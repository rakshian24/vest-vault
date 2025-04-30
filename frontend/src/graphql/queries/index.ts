import gql from "graphql-tag";

export const GET_ME = gql`
  query {
    me {
      _id
      username
      email
    }
  }
`;

export const GET_MY_RSUS = gql`
  query {
    myRsus {
      _id
      grantDate
      grantAmount
      stockPrice
      totalUnits
      vestedUnits
      vestingSchedule {
        vestDate
        grantedQty
        vestedQty
      }
      createdAt
    }
  }
`;

export const GET_ALL_TODOS = gql`
  query getAllTodos {
    _id
    title
    description
    isCompleted
    createdAt
    createdBy {
      _id
      username
    }
  }
`;

export const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      _id
      username
      email
    }
  }
`;
