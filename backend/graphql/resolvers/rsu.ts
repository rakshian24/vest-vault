import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Rsu, { IRsu } from "../../models/Rsu";
import { calculateVestingSchedule } from "../../utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { isEnabled } from "../../utils/flag";

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

      /* A sample code to test if the vercel feature flag is working - should be removed later */
      const isNewDashboardFFValue = await isEnabled("enableNewDashboard");
      console.log("isNewDashboardFFValue = ", isNewDashboardFFValue);

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
    async updateRsu(
      _: unknown,
      {
        rsuInput: { id, grantDate, grantAmount, stockPrice },
      }: {
        rsuInput: {
          id: string;
          grantDate: string;
          grantAmount: string;
          stockPrice: string;
        };
      },
      ctx: any
    ): Promise<IRsu> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const existingGrant = await Rsu.findById(id);
      if (!existingGrant) {
        throw new ApolloError("Grant not found", "NOT_FOUND");
      }

      if (existingGrant.createdBy.toString() !== userId) {
        throw new ApolloError("Unauthorized", "UNAUTHORIZED");
      }

      const parsedGrantDate = dayjs.utc(grantDate, "YYYY-MM-DD");
      const parsedAmount = parseFloat(grantAmount);
      const parsedStockPrice = parseFloat(stockPrice);

      const { totalUnits, vestingSchedule, vestedUnits } =
        calculateVestingSchedule(
          parsedGrantDate,
          parsedAmount,
          parsedStockPrice
        );

      existingGrant.grantDate = parsedGrantDate.toDate();
      existingGrant.grantAmount = parsedAmount;
      existingGrant.stockPrice = parsedStockPrice;
      existingGrant.totalUnits = totalUnits;
      existingGrant.vestedUnits = vestedUnits;
      existingGrant.vestingSchedule.splice(0);
      vestingSchedule.forEach((item) => {
        existingGrant.vestingSchedule.push(item);
      });

      const updated = await existingGrant.save();
      return updated.toObject() as IRsu;
    },
    async deleteRsu(
      _: unknown,
      { id }: { id: string },
      ctx: any
    ): Promise<boolean> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const rsu = await Rsu.findById(id);
      if (!rsu) {
        throw new ApolloError("Grant not found", "NOT_FOUND");
      }

      if (rsu.createdBy.toString() !== userId) {
        throw new ApolloError("Unauthorized", "UNAUTHORIZED");
      }

      await rsu.deleteOne();
      return true;
    },
  },
  Query: {
    async myRsus(_: unknown, args: {}, ctx: any): Promise<IRsu[] | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const myRsus = await Rsu.find({ createdBy: userId }).sort({
        grantDate: 1,
      });

      const rsusAsObjects = myRsus.map((todo) => todo.toObject()) as IRsu[];

      return rsusAsObjects;
    },
  },
};

export default resolvers;
