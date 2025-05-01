import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Rsu, { IRsu } from "../../models/Rsu";
import { Types } from "mongoose";
import { calculateVestingSchedule } from "../../utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface RsuInput {
  grantDate: string;
  grantAmount: number;
  stockPrice: number;
}

const resolvers = {
  Mutation: {
    async createRsu(
      _: unknown,
      {
        rsuInput: { grantDate, grantAmount, stockPrice },
      }: { rsuInput: RsuInput },
      ctx: any
    ): Promise<IRsu> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const parsedGrantDate = dayjs.utc(grantDate, "YYYY-MM-DD");

      const { totalUnits, vestingSchedule, vestedUnits } =
        calculateVestingSchedule(parsedGrantDate, grantAmount, stockPrice);

      const newRsu = new Rsu({
        grantDate: parsedGrantDate.toDate(),
        grantAmount,
        stockPrice,
        totalUnits,
        vestedUnits,
        vestingSchedule,
        createdBy: userId,
      });

      const res = (await newRsu.save()).toObject() as IRsu;

      return res;
    },
  },
  Query: {
    async myRsus(_: unknown, args: {}, ctx: any): Promise<IRsu[] | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const myRsus = await Rsu.find({ createdBy: userId });

      const rsusAsObjects = myRsus.map((todo) => todo.toObject()) as IRsu[];

      return rsusAsObjects;
    },
    async getAllTodos(_: unknown, args: {}, ctx: any): Promise<IRsu[]> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError(
          "User not authenticated or invalid user ID",
          "NOT_AUTHENTICATED"
        );
      }

      const query: any = {};

      const todos = await Rsu.find(query).populate("createdBy");

      const userObjectId = new Types.ObjectId(userId);

      return [];
    },
  },
};

export default resolvers;
