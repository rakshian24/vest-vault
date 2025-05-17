import React from "react";
import { Payslip } from "./PayslipTable";
import { Divider, Stack, SxProps, Typography } from "@mui/material";
import dayjs from "dayjs";
import ActionCell from "./ActionCell";
import { useCurrency } from "../../../context/currencyContext";
import { formatNumber } from "../../../utils";
import { colors } from "../../../constants";

type Props = {
  payslip: Payslip;
  onDelete: (id: string) => void;
  forexValue: number;
};

type PayslipCardBodyItemProps = {
  label: string;
  value: string;
  sx?: SxProps;
};

export const PayslipCardBodyItem = ({
  label,
  value,
  sx,
}: PayslipCardBodyItemProps) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    justifyContent={"space-between"}
  >
    <Typography sx={{ ...sx }}>{label}</Typography>
    <Typography sx={{ ...sx }}>{value}</Typography>
  </Stack>
);

const PayslipCard = ({ payslip, onDelete, forexValue }: Props) => {
  const { isUSD, symbol } = useCurrency();

  return (
    <Stack
      borderRadius={3}
      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
      bgcolor={colors.white}
      overflow="hidden"
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={2}
        bgcolor={colors.charcoalNavy}
        color={colors.white}
      >
        <Typography fontSize={"16px"} fontWeight={500}>
          {dayjs(payslip.payslipDate).format("MMMM, YYYY")}
        </Typography>
        <ActionCell onDelete={() => onDelete(payslip._id)} />
      </Stack>
      <Divider sx={{ gap: 0 }} />
      <Stack gap={1} px={2}>
        <PayslipCardBodyItem
          label="Earning"
          value={`${symbol} ${formatNumber(
            payslip.totalEarnings * forexValue,
            isUSD
          )}`}
          sx={{ pt: 2 }}
        />
        <PayslipCardBodyItem
          label="Deductions"
          value={`${symbol} ${formatNumber(
            payslip.totalDeductions * forexValue,
            isUSD
          )}`}
        />
        <PayslipCardBodyItem
          label="Net pay"
          value={`${symbol} ${formatNumber(
            payslip.netPay * forexValue,
            isUSD
          )}`}
          sx={{ pb: 2 }}
        />
      </Stack>
    </Stack>
  );
};

export default PayslipCard;
