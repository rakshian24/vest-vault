import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { FaMoneyBillWave, FaMinusCircle } from "react-icons/fa";
import { colors, screenSize } from "../../../constants";
import { formatNumber } from "../../../utils";
import { useCurrency } from "../../../context/currencyContext";
import { SalaryBreakdown } from "../../../hooks/useSalaryComponents";
import { useQuery } from "@apollo/client";
import { GET_EXCHANGE_RATE } from "../../../graphql/queries";
import CommonSkeleton from "../../../components/CommonSkeleton";

interface PayBreakdownRow {
  label: string;
  oldValue: number;
  newValue?: number;
}

interface PayBreakdownSectionProps {
  title: string;
  icon: React.ReactNode;
  rows: PayBreakdownRow[];
  totalLabel: string;
  totalOld: string;
  totalNew?: string;
  showWithHikeComparison: boolean;
  employerPF?: number;
  employerPFForHike?: number;
  isPeriodMonthly: boolean;
}

const PayBreakdownSection: React.FC<PayBreakdownSectionProps> = ({
  title,
  icon,
  rows,
  totalLabel,
  totalOld,
  totalNew,
  showWithHikeComparison,
  employerPF,
  isPeriodMonthly,
  employerPFForHike,
}) => {
  const { isUSD, symbol } = useCurrency();

  const fontSize = showWithHikeComparison ? "13px" : "14px";
  const px = showWithHikeComparison ? "4px" : "16px";

  return (
    <Box
      borderRadius={3}
      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
      bgcolor="#fff"
      overflow="hidden"
      px={1}
      py={2}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        <Box>{icon}</Box>
        <Typography variant="h6">{title}</Typography>
      </Stack>
      <TableContainer>
        <Table size="small">
          {showWithHikeComparison && (
            <TableHead>
              <TableRow>
                <TableCell sx={{ px }}></TableCell>
                <TableCell sx={{ px }} align="right">
                  Before Hike
                </TableCell>
                <TableCell sx={{ px }} align="right">
                  After Hike
                </TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ px, fontSize }}>{row.label}</TableCell>
                <TableCell align="right" sx={{ fontSize, px }}>
                  {`${symbol} ${formatNumber(row.oldValue, isUSD)}`}
                </TableCell>
                {showWithHikeComparison && (
                  <TableCell align="right" sx={{ fontSize, px }}>
                    {`${symbol} ${formatNumber(row.newValue || 0, isUSD)}`}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {!isPeriodMonthly && employerPF && employerPFForHike && (
              <TableRow>
                <TableCell sx={{ px, fontSize }}>{"Employer PF"}</TableCell>
                <TableCell align="right" sx={{ fontSize, px }}>
                  {`${symbol} ${formatNumber(employerPF, isUSD)}`}
                </TableCell>
                {showWithHikeComparison && (
                  <TableCell align="right" sx={{ fontSize, px }}>
                    {`${symbol} ${formatNumber(employerPFForHike || 0, isUSD)}`}
                  </TableCell>
                )}
              </TableRow>
            )}
            <TableRow>
              <TableCell sx={{ fontWeight: 600, px, fontSize }}>{totalLabel}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize, px }}>
                {`${symbol} ${totalOld}`}
              </TableCell>
              {showWithHikeComparison && (
                <TableCell align="right" sx={{ fontWeight: 600, fontSize, px }}>
                  {`${symbol} ${totalNew}`}
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

type EarningsDeductionTableProps = {
  showWithHikeComparison: boolean;
  isPeriodMonthly: boolean;
  salaryBreakdown: SalaryBreakdown;
  salaryBreakdownForHike: SalaryBreakdown | null;
};

const EarningsDeductionTable = ({
  showWithHikeComparison,
  isPeriodMonthly,
  salaryBreakdown,
  salaryBreakdownForHike,
}: EarningsDeductionTableProps) => {
  const { isUSD, symbol } = useCurrency();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { data: exchangeRateData, loading: isExchangeRateLoading } =
    useQuery(GET_EXCHANGE_RATE);

  if (isExchangeRateLoading) {
    return (
      <Stack gap={isTablet ? 3 : 4}>
        <CommonSkeleton height={250} sx={{ borderRadius: 6 }} />
        <CommonSkeleton height={300} sx={{ borderRadius: 6 }} />
      </Stack>
    );
  }

  const usdToInrValue = exchangeRateData?.getExchangeRate?.usdToInr;
  const forexValue = isUSD ? 1 / usdToInrValue : 1;

  const periodKey = isPeriodMonthly ? "monthly" : "annually";
  const currentEarnings = salaryBreakdown[periodKey].earnings;
  const currentDeductions = salaryBreakdown[periodKey].deductions;

  const currentEarningsForHike = salaryBreakdownForHike?.[periodKey]
    ?.earnings ?? {
    basic: 0,
    hra: 0,
    specialAllowance: 0,
  };

  const currentDeductionsForHike = salaryBreakdownForHike?.[periodKey]
    ?.deductions ?? {
    pfEEContribution: 0,
    professionalTax: 0,
    incomeTax: 0,
  };

  const earnings = [
    {
      label: "Basic Salary",
      oldValue: currentEarnings.basic * forexValue,
      newValue: currentEarningsForHike.basic * forexValue,
    },
    {
      label: "House Rent Allowance",
      oldValue: currentEarnings.hra * forexValue,
      newValue: currentEarningsForHike.hra * forexValue,
    },
    {
      label: "Special Allowance",
      oldValue: currentEarnings.specialAllowance * forexValue,
      newValue: currentEarningsForHike.specialAllowance * forexValue,
    },
  ];

  const deductions = [
    {
      label: "PF EE Contribution",
      oldValue: currentDeductions.pfEEContribution * forexValue,
      newValue: currentDeductionsForHike.pfEEContribution * forexValue,
    },
    {
      label: "Professional Tax",
      oldValue: currentDeductions.professionalTax * forexValue,
      newValue: currentDeductionsForHike.professionalTax * forexValue,
    },
    {
      label: "Income Tax",
      oldValue: currentDeductions.incomeTax * forexValue,
      newValue: currentDeductionsForHike.incomeTax * forexValue,
    },
  ];

  const totalEarnings = isPeriodMonthly
    ? earnings.reduce((acc, row) => acc + Number(row.oldValue), 0)
    : earnings.reduce((acc, row) => acc + Number(row.oldValue), 0) +
      salaryBreakdown.annualEmployerPf;

  const totalDeductions = deductions.reduce(
    (acc, row) => acc + Number(row.oldValue),
    0
  );
  const totalEarningsForHike = isPeriodMonthly
    ? earnings.reduce((acc, row) => acc + Number(row.newValue), 0)
    : earnings.reduce((acc, row) => acc + Number(row.newValue), 0) +
      (salaryBreakdownForHike?.annualEmployerPf || 0);

  const totalDeductionsForHike = deductions.reduce(
    (acc, row) => acc + Number(row.newValue),
    0
  );

  const formattedTotalEarnings = formatNumber(totalEarnings, isUSD);
  const formattedTotalDeductions = formatNumber(totalDeductions, isUSD);
  const netPay = totalEarnings - totalDeductions;
  const formattedNetPay = formatNumber(netPay, isUSD);

  const formattedTotalEarningsForHike = formatNumber(
    totalEarningsForHike,
    isUSD
  );
  const formattedTotalDeductionsForHike = formatNumber(
    totalDeductionsForHike,
    isUSD
  );
  const netPayForHike = totalEarningsForHike - totalDeductionsForHike;
  const formattedNetPayForHike = formatNumber(netPayForHike, isUSD);

  const safeShowWithHikeComparison =
    showWithHikeComparison && !!salaryBreakdownForHike;

  return (
    <Stack gap={2} mt={1}>
      <PayBreakdownSection
        title="Earnings"
        icon={
          <FaMoneyBillWave
            color={colors.green1}
            fontSize={"20px"}
            style={{ marginTop: "4px" }}
          />
        }
        rows={earnings}
        totalLabel="Total Earnings"
        totalOld={formattedTotalEarnings}
        totalNew={formattedTotalEarningsForHike}
        showWithHikeComparison={safeShowWithHikeComparison}
        isPeriodMonthly={isPeriodMonthly}
        employerPF={salaryBreakdown.annualEmployerPf}
        employerPFForHike={salaryBreakdownForHike?.annualEmployerPf || 0}
      />

      <PayBreakdownSection
        title="Deductions"
        icon={
          <FaMinusCircle
            color={colors.red}
            fontSize={"20px"}
            style={{ marginTop: "4px" }}
          />
        }
        rows={deductions}
        totalLabel="Total Deductions"
        totalOld={formattedTotalDeductions}
        totalNew={formattedTotalDeductionsForHike}
        showWithHikeComparison={safeShowWithHikeComparison}
        isPeriodMonthly={isPeriodMonthly}
      />

      <Stack
        bgcolor={colors.slate700}
        px={2}
        py={1.5}
        borderRadius={3}
        textAlign={"center"}
      >
        <Typography color={colors.white} fontSize={"1rem"}>
          Net In-Hand
        </Typography>
        {showWithHikeComparison ? (
          <Stack
            display={"flex"}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack>
              <Typography
                fontSize={"1.25rem"}
                fontWeight={600}
                color={colors.white}
              >{`${symbol} ${formattedNetPay}`}</Typography>
              <Typography color={colors.white}>Before Hike</Typography>
            </Stack>
            <Stack>
              <Typography
                fontSize={"1.25rem"}
                fontWeight={600}
                color={colors.white}
              >{`${symbol} ${formattedNetPayForHike}`}</Typography>
              <Typography color={colors.white}>After Hike</Typography>
            </Stack>
          </Stack>
        ) : (
          <Typography
            fontSize={"1.25rem"}
            fontWeight={600}
            color={colors.white}
          >{`${symbol} ${formattedNetPay}`}</Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default EarningsDeductionTable;
