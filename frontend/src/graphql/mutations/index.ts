import gql from "graphql-tag";

export const REGISTER_USER_MUTATION = gql`
  mutation Mutation($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Mutation($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      token
      user {
        _id
        email
        username
      }
    }
  }
`;

export const CREATE_RSU = gql`
  mutation Mutation($rsuInput: RsuInput) {
    createRsu(rsuInput: $rsuInput) {
      _id
      grantDate
      grantAmount
      stockPrice
      totalUnits
      vestingSchedule {
        vestDate
        grantedQty
        vestedQty
      }
    }
  }
`;
