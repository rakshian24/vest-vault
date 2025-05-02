import userResolvers from "./users";
import rsuResolvers from "./rsu";
import finnhubResolvers from "./finnhub";
import exchangeRateResolvers from "./exchangeRate";

export default {
  Query: {
    ...userResolvers.Query,
    ...rsuResolvers.Query,
    ...finnhubResolvers.Query,
    ...exchangeRateResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...rsuResolvers.Mutation,
  },
};
