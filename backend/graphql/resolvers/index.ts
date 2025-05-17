import userResolvers from "./users";
import rsuResolvers from "./rsu";
import finnhubResolvers from "./finnhub";
import exchangeRateResolvers from "./exchangeRate";
import payslipResolvers from "./payslip";

export default {
  Query: {
    ...userResolvers.Query,
    ...rsuResolvers.Query,
    ...finnhubResolvers.Query,
    ...exchangeRateResolvers.Query,
    ...payslipResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...rsuResolvers.Mutation,
    ...payslipResolvers.Mutation,
  },
};
