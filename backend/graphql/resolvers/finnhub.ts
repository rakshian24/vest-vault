import axios from "axios";
import { cache } from "../../utils/cache";
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

      const stockKey = `stock:${symbol}`;

      let source: "api" | "cache" = "api";
      let currentPrice: number;

      const cachedStock = cache.get<number>(stockKey);

      if (cachedStock !== undefined) {
        currentPrice = cachedStock;
        source = "cache";
      } else {
        const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );

        currentPrice = response.data?.c ?? 0;

        if (currentPrice > 0) cache.set(stockKey, currentPrice);
      }

      return {
        stockPriceInUSD: +currentPrice.toFixed(2),
        source,
      };
    },
  },
};

export default resolvers;
