import axios from "axios";
import { redis } from "../../utils/redis";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import { ApolloError } from "apollo-server-errors";

interface IStockPrice {
  stockPriceInUSD: number;
  source: "api" | "cache";
}

const resolvers = {
  Query: {
    getStockPrice: async (
      _: any,
      { symbol }: { symbol: string },
      ctx: any
    ): Promise<IStockPrice> => {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;
      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

      if (!FINNHUB_API_KEY) {
        throw new Error("Missing FINNHUB_API_KEY");
      }

      const stockKey = `stock:${symbol}`;
      let source: "api" | "cache" = "api";

      let currentPrice: number;

      const cachedPrice = await redis.get<number>(stockKey);

      if (cachedPrice !== null && cachedPrice > 0) {
        currentPrice = cachedPrice;
        source = "cache";
      } else {
        const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        const fetchedPrice = response.data?.c ?? 0;

        currentPrice = fetchedPrice;

        if (currentPrice > 0) {
          await redis.set(stockKey, currentPrice, { ex: 180 }); // 3 minutes TTL
        }
      }

      return {
        stockPriceInUSD: +currentPrice.toFixed(2),
        source,
      };
    },
  },
};

export default resolvers;
