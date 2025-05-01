import { Stack, Typography, useMediaQuery } from "@mui/material";
import { screenSize } from "../../constants";
import { User } from "../../context/authContext";
import CommonSkeleton from "../../components/CommonSkeleton";
import { useQuery } from "@apollo/client";
import { GET_MY_RSUS } from "../../graphql/queries";
import VestingSchedule from "../../components/VestingSchedule";
import { useCurrency } from "../../context/currencyContext";
import StockUnitsOverview from "../../components/StockUnitsOverview";
import NoGrants from "./components/NoGrants";
import { useFlag } from "../../featureFlag/useFlag";

const Dashboard = ({ userInfo }: { userInfo: User | null }) => {
  /* A sample code to test if the vercel feature flag is working - should be removed later */
  const showNew = useFlag("enableNewDashboard", false);
  console.log("SHOW_NEW_FF_VALUE = ", showNew);

  const { isUSD } = useCurrency();

  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { data, loading: isRsusLoading } = useQuery(GET_MY_RSUS);

  const totalUnits = data?.myRsus?.reduce((sum: any, rsu: any) => {
    return sum + rsu.totalUnits;
  }, 0);

  const vestedUnits = data?.myRsus?.reduce((sum: any, rsu: any) => {
    return sum + rsu.vestedUnits;
  }, 0);

  const STOCK_PRICE = Number((617.89911).toFixed(2));
  const USD_TO_INR_VALUE = Number((84.64).toFixed(2));
  const FOREX_VALUE = isUSD ? 1 : USD_TO_INR_VALUE;
  const FOREX_STOCK_PRICE = Number((STOCK_PRICE * FOREX_VALUE).toFixed(2));

  return (
    <Stack gap={isTablet ? 3 : 4}>
      <Typography variant={isTablet ? "h5" : "h4"} mb={2}>
        Welcome, {userInfo?.username}!
      </Typography>

      {/* A sample code to test if the vercel feature flag is working - should be removed later */}
      <Typography variant="h4">
        {showNew ? "I am from Feature Flag" : "I am NOT from Feature Flag"}
      </Typography>

      {isRsusLoading ? (
        <CommonSkeleton height={350} sx={{ borderRadius: isTablet ? 3 : 6 }} />
      ) : (
        <>
          {data && data.myRsus.length > 0 ? (
            <Stack gap={3}>
              <StockUnitsOverview
                totalUnits={totalUnits}
                vestedUnits={vestedUnits}
                totalGrantsValue={totalUnits * FOREX_STOCK_PRICE}
                vestedInrValue={vestedUnits * FOREX_STOCK_PRICE}
                usdToInr={USD_TO_INR_VALUE}
                stockPrice={FOREX_STOCK_PRICE}
              />
              <VestingSchedule
                rsuData={data?.myRsus || []}
                forexStockPrice={FOREX_STOCK_PRICE}
              />
            </Stack>
          ) : (
            <NoGrants />
          )}
        </>
      )}
    </Stack>
  );
};

export default Dashboard;
