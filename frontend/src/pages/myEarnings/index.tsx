import { Stack, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { colors, ROUTES, screenSize } from "../../constants";
import UploadPayslipForm from "./components/UploadPayslipForm";
import PayslipTable from "./components/PayslipTable";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EXCHANGE_RATE, GET_MY_PAYSLIPS } from "../../graphql/queries";
import CommonSkeleton from "../../components/CommonSkeleton";
import { useCurrency } from "../../context/currencyContext";
import NoPayslips from "./components/NoPayslips";
import { NavLink } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { usePayslipOCR } from "../../hooks/usePayslipOCR";
import { CREATE_PAYSLIP, DELETE_PAYSLIP } from "../../graphql/mutations";
import { useSnackbar } from "../../context/SnackbarContext";

const MyEarnings = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { isUSD } = useCurrency();
  const { showSuccess, showError } = useSnackbar();

  const { extractPayslipData } = usePayslipOCR();
  const [createPayslip] = useMutation(CREATE_PAYSLIP);
  const [deletePayslip] = useMutation(DELETE_PAYSLIP);

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

  const payslipsData = data?.myPayslips?.myPayslips || [];
  const aggregateData = data?.myPayslips?.aggregate || {
    totalEarnings: 0,
    totalDeductions: 0,
    totalNetpay: 0,
  };

  const handleUpload = async (file: File) => {
    const parsed = await extractPayslipData(file);

    if (!parsed) {
      showError(
        "Failed to extract payslip data. Please upload a new set of payslip."
      );
      console.error("Failed to extract payslip data");
      return;
    }

    const {
      extractedText,
      totalEarnings,
      totalDeductions,
      netPay,
      payslipMonth,
    } = parsed;

    try {
      await createPayslip({
        variables: {
          payslipInput: {
            payslipDate: payslipMonth,
            extractedText,
            totalEarnings,
            totalDeductions,
            netPay,
          },
        },
      });
      showSuccess("Payslip uploaded successfully!");

      refetch();
    } catch (err: any) {
      const code = err?.graphQLErrors?.[0]?.extensions?.code;
      const message = err?.graphQLErrors?.[0]?.message || "Upload failed.";
      if (code === "DUPLICATE_PAYSLIP") {
        showError(message);
      } else {
        showError("Something went wrong while uploading the payslip.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePayslip({ variables: { id } });
      refetch();
      showSuccess("Payslip deleted successfully!");
    } catch (err: any) {
      const message =
        err?.graphQLErrors?.[0]?.message || "Delete payslip failed.";
      showError(message);
    }
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
          onDelete={handleDelete}
          forexValue={forexValue}
          aggregateData={aggregateData}
        />
      ) : (
        <NoPayslips handleUpload={handleUpload} />
      )}
    </Stack>
  );
};

export default MyEarnings;
