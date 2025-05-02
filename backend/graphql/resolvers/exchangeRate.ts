import axios from "axios";
import { cache } from "../../utils/cache";
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
      {},
      ctx: any
    ): Promise<IExchangeRate> => {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      let usdToInr: number;
      let source: "api" | "cache" = "api";

      const EXCHANGE_RATE_KEY = "fx:USDINR";
      const EXCHANGE_RATE_TTL = 86400; // 24 hours
      const EXCHANGE_RATES_API_KEY = process.env.EXCHANGE_RATES_API_KEY;

      const cachedRate = cache.get<number>(EXCHANGE_RATE_KEY);

      if (cachedRate !== undefined) {
        usdToInr = cachedRate;
        source = "cache";
      } else {
        const response = await axios.get(
          `https://api.exchangeratesapi.io/v1/latest?access_key=${EXCHANGE_RATES_API_KEY}&symbols=USD,INR`
        );

        if (!response.data?.success) {
          throw new Error("Exchange rates API request failed");
        }

        const usdPerEur = response.data.rates?.USD;
        const inrPerEur = response.data.rates?.INR;

        if (!usdPerEur || !inrPerEur) {
          throw new Error("Missing USD or INR rate from API response");
        }

        usdToInr = +(inrPerEur / usdPerEur).toFixed(2);

        if (usdToInr > 0) {
          cache.set(EXCHANGE_RATE_KEY, usdToInr, EXCHANGE_RATE_TTL);
        }
      }

      return {
        usdToInr,
        source,
      };
    },
  },
};

export default resolvers;
