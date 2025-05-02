import { Stack, Typography, useMediaQuery } from "@mui/material";
import { screenSize } from "../../constants";
import { User } from "../../context/authContext";
import CommonSkeleton from "../../components/CommonSkeleton";
import { useQuery } from "@apollo/client";
import {
  GET_EXCHANGE_RATE,
  GET_MY_RSUS,
  GET_STOCK_PRICE,
} from "../../graphql/queries";
import VestingSchedule from "../../components/VestingSchedule";
import { useCurrency } from "../../context/currencyContext";
import StockUnitsOverview from "../../components/StockUnitsOverview";
import NoGrants from "./components/NoGrants";
import VestingScheduleSummary from "../../components/VestingSchedule/mobile/VestingScheduleSummary";

const Dashboard = ({ userInfo }: { userInfo: User | null }) => {
  const { isUSD } = useCurrency();

  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { data, loading: isRsusLoading } = useQuery(GET_MY_RSUS);

  const { data: exchangeRateData, loading: isExchangeRateLoading } =
    useQuery(GET_EXCHANGE_RATE);

  const { data: stockPriceData, loading: isStockPriceLoading } = useQuery(
    GET_STOCK_PRICE,
    {
      variables: {
        symbol: "INTU",
      },
    }
  );

  if (isRsusLoading || isExchangeRateLoading || isStockPriceLoading) {
    return (
      <Stack gap={isTablet ? 3 : 4}>
        <CommonSkeleton height={250} sx={{ borderRadius: 6 }} />
        <CommonSkeleton height={300} sx={{ borderRadius: 6 }} />
      </Stack>
    );
  }

  const totalUnits = data?.myRsus?.reduce((sum: any, rsu: any) => {
    return sum + rsu.totalUnits;
  }, 0);

  const vestedUnits = data?.myRsus?.reduce((sum: any, rsu: any) => {
    return sum + rsu.vestedUnits;
  }, 0);

  const stockPrice = stockPriceData?.getStockPrice?.stockPriceInUSD;
  const usdToInrValue = exchangeRateData?.getExchangeRate?.usdToInr;
  const forexValue = isUSD ? 1 : usdToInrValue;
  const forexStockPrice = stockPrice * forexValue;

  return (
    <Stack gap={isTablet ? 0 : 4}>
      <Typography variant={isTablet ? "h5" : "h4"} mb={2}>
        Welcome, {userInfo?.username}!
      </Typography>

      {data && data.myRsus.length > 0 ? (
        <Stack gap={3}>
          <StockUnitsOverview
            totalUnits={totalUnits}
            vestedUnits={vestedUnits}
            totalGrantsValue={totalUnits * forexStockPrice}
            vestedInrValue={vestedUnits * forexStockPrice}
            usdToInr={usdToInrValue}
            stockPrice={forexStockPrice}
          />
          {isTablet ? (
            <VestingScheduleSummary
              rsuData={data?.myRsus || []}
              forexStockPrice={forexStockPrice}
            />
          ) : (
            <VestingSchedule
              rsuData={data?.myRsus || []}
              forexStockPrice={forexStockPrice}
            />
          )}
        </Stack>
      ) : (
        <NoGrants />
      )}
    </Stack>
  );
};

export default Dashboard;
