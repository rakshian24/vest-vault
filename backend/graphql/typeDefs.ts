import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

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
    vestDate: DateTime!
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
    grantDate: DateTime!
    grantAmount: Float!
    stockPrice: Float!
    totalUnits: Int!
    vestedUnits: Int!
    vestingSchedule: [IVestingEvent]!
    createdBy: User!
    createdAt: DateTime
  }

  input RsuInput {
    grantDate: String!
    grantAmount: String!
    stockPrice: String!
  }

  type Query {
    me: User
    myRsus: [Rsu]
    getAllTodos: [Rsu]
    user(id: ID!): User
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): AuthResponse
    loginUser(loginInput: LoginInput): AuthResponse
    createRsu(rsuInput: RsuInput): Rsu
  }
`;
