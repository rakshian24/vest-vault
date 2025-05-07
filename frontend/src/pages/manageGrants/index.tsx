import { useQuery } from "@apollo/client";
import { GET_EXCHANGE_RATE, GET_MY_RSUS } from "../../graphql/queries";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import CommonSkeleton from "../../components/CommonSkeleton";
import { colors, ROUTES, screenSize } from "../../constants";
import { IRsuData } from "../../components/VestingSchedule/types";
import NoGrants from "../dashboard/components/NoGrants";
import { NavLink } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Button from "../../components/CustomButton";
import { useGrantDialog } from "../../context/GrantDialogContext";
import { AddOutlined } from "@mui/icons-material";
import GrantCard from "../../components/GrantCard";
import dayjs from "dayjs";
import { useCurrency } from "../../context/currencyContext";

type Props = {};

const ManageGrantsPage = (props: Props) => {
  const { data, loading: isRsusLoading } = useQuery(GET_MY_RSUS);
  const { data: exchangeRateData, loading: isExchangeRateLoading } = useQuery(
    GET_EXCHANGE_RATE,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const { isUSD } = useCurrency();

  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { openGrantDialog, setOnCreated } = useGrantDialog();
  const { refetch } = useQuery(GET_MY_RSUS);

  if (isRsusLoading || isExchangeRateLoading) {
    return (
      <Stack gap={isTablet ? 3 : 4}>
        <CommonSkeleton height={250} sx={{ borderRadius: 6 }} />
        <CommonSkeleton height={300} sx={{ borderRadius: 6 }} />
      </Stack>
    );
  }

  const rsuData: IRsuData[] = data?.myRsus || [];
  const usdToInrValue = exchangeRateData?.getExchangeRate?.usdToInr;
  const forexValue = isUSD ? 1 : usdToInrValue;

  if (rsuData.length === 0) {
    return <NoGrants />;
  }

  return (
    <Stack>
      <Stack direction={"row"} spacing={2} alignItems={"center"} mb={1}>
        <NavLink to={ROUTES.DASHBOARD}>
          <FaChevronLeft color={colors.contentTertiary} fontSize={"1.2rem"} />
        </NavLink>
        <Typography fontWeight={600} mb={1} fontSize="1.4rem">
          Manage Grants
        </Typography>
      </Stack>

      <Button
        buttonText="Add Grant"
        startIcon={<AddOutlined />}
        onClick={() => {
          setOnCreated(() => () => refetch());
          openGrantDialog();
        }}
        styles={{ alignSelf: "flex-end" }}
      />

      <Stack spacing={2}>
        <Typography fontWeight={600} fontSize="1.2rem">
          Your Grants
        </Typography>
        <Stack spacing={2}>
          {rsuData.map((rsu) => {
            return (
              <GrantCard
                key={rsu._id}
                dateLabel={`Granted on ${dayjs(rsu.grantDate).format(
                  "D MMM, YYYY"
                )}`}
                rsuCount={rsu.totalUnits}
                onEdit={() => console.log("Edit 2025")}
                onDelete={() => console.log("Delete 2025")}
                forexValue={forexValue}
                grantAmount={rsu.grantAmount}
              />
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ManageGrantsPage;
