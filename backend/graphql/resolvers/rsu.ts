import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Rsu, { IRsu } from "../../models/Rsu";
import { Types } from "mongoose";
import dayjs from "dayjs";

interface RsuInput {
  grantDate: String;
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

      const newRsu = new Rsu({
        grantDate,
        grantAmount,
        stockPrice,
        createdBy: userId,
      });

      const res = (await newRsu.save()).toObject() as IRsu;

      return { ...res, grantDate: dayjs(res.grantDate).format("DD/MMM/YYYY") };
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

      const rsusAsObjects = myRsus.map((rsu) => {
        const obj = rsu.toObject() as IRsu;
        return {
          ...obj,
          grantDate: dayjs(obj.grantDate).format("DD/MMM/YYYY"),
        };
      });

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
