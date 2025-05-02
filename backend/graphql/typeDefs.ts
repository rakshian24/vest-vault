import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar Date

  type User {
    _id: ID!
    username: String
    email: String
  }

  type AuthResponse {
    user: User
    token: String
  }

  type IVestingEvent {
    _id: ID!
    vestDate: Date!
    grantedQty: Int!
    vestedQty: Int!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Rsu {
    _id: ID!
    grantDate: Date!
    grantAmount: Float!
    stockPrice: Float!
    totalUnits: Int!
    vestedUnits: Int!
    vestingSchedule: [IVestingEvent]!
    createdBy: User!
    createdAt: DateTime
  }

  type StockPrice {
    stockPriceInUSD: Float!
    source: String!
  }

  type ExchangeRate {
    usdToInr: Float!
    source: String!
  }

  input RsuInput {
    grantDate: String!
    grantAmount: String!
    stockPrice: String!
  }

  type Query {
    me: User
    myRsus: [Rsu]
    user(id: ID!): User
    getStockPrice(symbol: String!): StockPrice
    getExchangeRate: ExchangeRate
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): AuthResponse
    loginUser(loginInput: LoginInput): AuthResponse
    createRsu(rsuInput: RsuInput): Rsu
  }
`;
