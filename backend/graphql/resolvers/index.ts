import userResolvers from "./users";
import rsuResolvers from "./rsu";

export default {
  Query: {
    ...userResolvers.Query,
    ...rsuResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...rsuResolvers.Mutation,
  },
};
