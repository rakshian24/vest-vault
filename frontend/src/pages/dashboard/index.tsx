import { Stack, Typography, useMediaQuery } from "@mui/material";
import { screenSize } from "../../constants";
import { User } from "../../context/authContext";
import CommonSkeleton from "../../components/CommonSkeleton";
import { useQuery } from "@apollo/client";
import { GET_MY_RSUS } from "../../graphql/queries";

const Dashboard = ({ userInfo }: { userInfo: User | null }) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { data, loading: isRsusLoading } = useQuery(GET_MY_RSUS);

  return (
    <Stack gap={isTablet ? 3 : 4}>
      <Typography variant={isTablet ? "h5" : "h4"} mb={2}>
        Welcome, {userInfo?.username}!
      </Typography>

      {isRsusLoading ? (
        <CommonSkeleton height={350} sx={{ borderRadius: isTablet ? 3 : 6 }} />
      ) : (
        <Stack gap={2}>
          {data?.myRsus?.map((rsu: any) => {
            return <Typography>Grant Date: {rsu.grantDate}</Typography>;
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default Dashboard;
