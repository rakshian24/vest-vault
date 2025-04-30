import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar IntOrString

  type User {
    _id: ID!
    username: String
    email: String
  }

  type AuthResponse {
    user: User
    token: String
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
    grantDate: String!
    grantAmount: Float!
    stockPrice: Float!
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
