import { Stack, Typography, useMediaQuery } from "@mui/material";
import { screenSize } from "../../constants";
import { User } from "../../context/authContext";
import CommonSkeleton from "../../components/CommonSkeleton";
import { useQuery } from "@apollo/client";
import { GET_MY_RSUS } from "../../graphql/queries";
import StockUnitsOverview from "../../components/StockUnitsOverview";
import VestingSchedule from "../../components/VestingSchedule";

const Dashboard = ({ userInfo }: { userInfo: User | null }) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { data, loading: isRsusLoading } = useQuery(GET_MY_RSUS);

  console.log(data);

  return (
    <Stack gap={isTablet ? 3 : 4}>
      <Typography variant={isTablet ? "h5" : "h4"} mb={2}>
        Welcome, {userInfo?.username}!
      </Typography>

      {isRsusLoading ? (
        <CommonSkeleton height={350} sx={{ borderRadius: isTablet ? 3 : 6 }} />
      ) : (
        <Stack gap={3}>
          <StockUnitsOverview
            totalUnits={55000}
            vestedUnits={23}
            totalGrantsValue={186000}
            vestedInrValue={18707204}
            usdToInr={83}
            stockPrice={600}
          />
          <VestingSchedule rsuData={data?.myRsus || []} />
        </Stack>
      )}
    </Stack>
  );
};

export default Dashboard;
