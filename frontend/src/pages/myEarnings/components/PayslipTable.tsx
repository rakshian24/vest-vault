import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ActionCell from "./ActionCell";
import dayjs from "dayjs";
import { useCurrency } from "../../../context/currencyContext";
import { formatNumber } from "../../../utils";
import { colors } from "../../../constants";

export type Payslip = {
  _id: string;
  payslipDate: string;
  extractedText: string;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
};

export type PayslipAggregate = {
  totalEarnings: number;
  totalDeductions: number;
  totalNetpay: number;
};

type Props = {
  payslips: Payslip[];
  onDelete: (id: string) => void;
  forexValue: number;
  aggregateData: PayslipAggregate;
};

const PayslipTable = ({
  payslips,
  onDelete,
  forexValue,
  aggregateData,
}: Props) => {
  const { isUSD, symbol } = useCurrency();

  const centeredCell = {
    fontSize: "16px",
    textAlign: "center",
    color: colors.white,
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: colors.charcoalNavy }}>
          <TableRow>
            <TableCell sx={centeredCell}>Action</TableCell>
            <TableCell sx={centeredCell}>Payslip Date</TableCell>
            <TableCell sx={centeredCell}>Earnings</TableCell>
            <TableCell sx={centeredCell}>Deductions</TableCell>
            <TableCell sx={centeredCell}>Net Pay</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payslips.map((payslip) => (
            <TableRow key={payslip._id}>
              <TableCell align="center">
                <ActionCell onDelete={() => onDelete(payslip._id)} />
              </TableCell>
              <TableCell align="center">
                {dayjs(payslip.payslipDate).format("MMMM, YYYY")}
              </TableCell>
              <TableCell align="center">
                {`${symbol} ${formatNumber(
                  payslip.totalEarnings * forexValue,
                  isUSD
                )}`}
              </TableCell>
              <TableCell align="center">
                {`${symbol} ${formatNumber(
                  payslip.totalDeductions * forexValue,
                  isUSD
                )}`}
              </TableCell>
              <TableCell align="center">
                {`${symbol} ${formatNumber(
                  payslip.netPay * forexValue,
                  isUSD
                )}`}
              </TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ bgcolor: colors.mediumSlateIndigo2 }}>
            <TableCell
              align="center"
              colSpan={2}
              sx={{ fontWeight: 600, fontSize: "16px", color: colors.white }}
            >
              TOTAL
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 600, fontSize: "16px", color: colors.white }}
            >
              {`${symbol} ${formatNumber(
                aggregateData.totalEarnings * forexValue,
                isUSD
              )}`}
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 600, fontSize: "16px", color: colors.white }}
            >
              {`${symbol} ${formatNumber(
                aggregateData.totalDeductions * forexValue,
                isUSD
              )}`}
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 600, fontSize: "16px", color: colors.white }}
            >
              {`${symbol} ${formatNumber(
                aggregateData.totalNetpay * forexValue,
                isUSD
              )}`}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PayslipTable;
