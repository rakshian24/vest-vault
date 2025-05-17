import React from "react";
import { Payslip, PayslipAggregate } from "./PayslipTable";
import { Divider, Stack, Typography } from "@mui/material";
import PayslipCard, { PayslipCardBodyItem } from "./PayslipCard";
import { useCurrency } from "../../../context/currencyContext";
import { formatNumber } from "../../../utils";
import { colors } from "../../../constants";

type Props = {
  payslips: Payslip[];
  onDelete: (id: string) => void;
  forexValue: number;
  aggregateData: PayslipAggregate;
};

const PayslipCards = ({
  payslips,
  onDelete,
  forexValue,
  aggregateData,
}: Props) => {
  const { isUSD, symbol } = useCurrency();

  return (
    <Stack gap={2} mt={1}>
      {payslips.map((payslip) => (
        <PayslipCard
          key={payslip._id}
          payslip={payslip}
          onDelete={onDelete}
          forexValue={forexValue}
        />
      ))}
      <Stack
        borderRadius={3}
        boxShadow="0 4px 20px rgba(0,0,0,0.08)"
        bgcolor={colors.mediumSlateIndigo2}
        overflow="hidden"
        padding={2}
        gap={1.5}
        color={colors.white}
      >
        <Typography fontSize={"16px"} fontWeight={600} textAlign={"center"}>
          TOTAL
        </Typography>
        <Divider />
        <Stack gap={1}>
          <PayslipCardBodyItem
            label="Total Earnings"
            value={`${symbol} ${formatNumber(
              aggregateData.totalEarnings * forexValue,
              isUSD
            )}`}
            sx={{ fontWeight: 500 }}
          />
          <PayslipCardBodyItem
            label="Total Deductions"
            value={`${symbol} ${formatNumber(
              aggregateData.totalDeductions * forexValue,
              isUSD
            )}`}
            sx={{ fontWeight: 500 }}
          />
          <PayslipCardBodyItem
            label="Total Net pay"
            value={`${symbol} ${formatNumber(
              aggregateData.totalNetpay * forexValue,
              isUSD
            )}`}
            sx={{ fontWeight: 500 }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PayslipCards;
