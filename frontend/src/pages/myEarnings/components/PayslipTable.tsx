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

export type Payslip = {
  _id: string;
  payslipDate: string;
  extractedText: string;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
};

type Props = {
  payslips: Payslip[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  forexValue: number;
};

const PayslipTable = ({ payslips, onEdit, onDelete, forexValue }: Props) => {
  const { isUSD, symbol } = useCurrency();

  const centeredCell = { fontSize: "16px", textAlign: "center" };

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={centeredCell}>Action</TableCell>
            <TableCell sx={centeredCell}>Payslip Date</TableCell>
            <TableCell sx={centeredCell}>Total Earnings</TableCell>
            <TableCell sx={centeredCell}>Total Deductions</TableCell>
            <TableCell sx={centeredCell}>Net Pay</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payslips.map((payslip) => (
            <TableRow key={payslip._id}>
              <TableCell align="center">
                <ActionCell
                  onEdit={() => onEdit(payslip._id)}
                  onDelete={() => onDelete(payslip._id)}
                />
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
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PayslipTable;
