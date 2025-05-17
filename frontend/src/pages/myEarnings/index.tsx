import { Stack, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useAuth } from "../../context/authContext";
import { colors, ROUTES, screenSize } from "../../constants";
import UploadPayslipForm from "./components/UploadPayslipForm";
import PayslipTable from "./components/PayslipTable";
import { useQuery } from "@apollo/client";
import { GET_EXCHANGE_RATE, GET_MY_PAYSLIPS } from "../../graphql/queries";
import CommonSkeleton from "../../components/CommonSkeleton";
import { useCurrency } from "../../context/currencyContext";
import NoPayslips from "./components/NoPayslips";
import { NavLink } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";

const MyEarnings = () => {
  const { token } = useAuth();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { isUSD } = useCurrency();

  const {
    data,
    loading: isPayslipsLoading,
    refetch,
  } = useQuery(GET_MY_PAYSLIPS);

  const { data: exchangeRateData, loading: isExchangeRateLoading } =
    useQuery(GET_EXCHANGE_RATE);

  if (isPayslipsLoading || isExchangeRateLoading) {
    return (
      <Stack gap={isTablet ? 3 : 4}>
        <CommonSkeleton height={250} sx={{ borderRadius: 6 }} />
        <CommonSkeleton height={300} sx={{ borderRadius: 6 }} />
      </Stack>
    );
  }

  const usdToInrValue = exchangeRateData?.getExchangeRate?.usdToInr;
  const forexValue = isUSD ? 1 / usdToInrValue : 1;

  const payslipsData = data?.myPayslips || [];

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-payslip", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        refetch();
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete", id);
  };

  return (
    <Stack spacing={isTablet ? 2 : 4}>
      <Stack direction={"row"} spacing={2} alignItems={"center"} mb={1}>
        <NavLink to={ROUTES.DASHBOARD}>
          <FaChevronLeft color={colors.contentTertiary} fontSize={"1.2rem"} />
        </NavLink>
        <Typography fontWeight={600} mb={1} variant="h5">
          My Earnings
        </Typography>
      </Stack>

      {payslipsData.length > 0 && <UploadPayslipForm onUpload={handleUpload} />}

      {payslipsData.length > 0 ? (
        <PayslipTable
          payslips={payslipsData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          forexValue={forexValue}
        />
      ) : (
        <NoPayslips handleUpload={handleUpload} />
      )}
    </Stack>
  );
};

export default MyEarnings;
