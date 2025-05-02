import axios from "axios";
import { redis } from "../../utils/redis";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import { ApolloError } from "apollo-server-errors";

interface IExchangeRate {
  usdToInr: number;
  source: "api" | "cache";
}

const resolvers = {
  Query: {
    getExchangeRate: async (
      _: unknown,
      __: any,
      ctx: any
    ): Promise<IExchangeRate> => {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;
      if (!userId)
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");

      let usdToInr: number;
      let source: "api" | "cache" = "api";

      const key = "fx:USDINR";
      const cached = await redis.get<number>(key);

      if (cached !== null) {
        usdToInr = cached;
        source = "cache";
      } else {
        const API_KEY = process.env.EXCHANGE_RATES_API_KEY;
        const res = await axios.get(
          `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}&symbols=USD,INR`
        );

        if (!res.data?.success) {
          throw new Error("Exchange rates API request failed");
        }

        const usd = res.data.rates?.USD;
        const inr = res.data.rates?.INR;
        if (!usd || !inr) throw new Error("Missing USD or INR");

        usdToInr = +(inr / usd).toFixed(2);
        await redis.set(key, usdToInr, { ex: 86400 }); // TTL: 1 day
      }

      return {
        usdToInr,
        source,
      };
    },
  },
};

export default resolvers;
