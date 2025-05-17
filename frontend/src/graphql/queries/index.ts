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
        _id
        vestDate
        grantedQty
        vestedQty
      }
      createdAt
    }
  }
`;

export const GET_STOCK_PRICE = gql`
  query getStockPrice($symbol: String!) {
    getStockPrice(symbol: $symbol) {
      stockPriceInUSD
      source
    }
  }
`;

export const GET_EXCHANGE_RATE = gql`
  query {
    getExchangeRate {
      usdToInr
      source
    }
  }
`;

export const GET_MY_PAYSLIPS = gql`
  query {
    myPayslips {
      myPayslips {
        _id
        payslipDate
        totalEarnings
        totalDeductions
        netPay
        createdAt
        updatedAt
      }
      aggregate {
        totalEarnings
        totalDeductions
        totalNetpay
      }
    }
  }
`;
