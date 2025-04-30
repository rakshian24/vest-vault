import { Box, Grid, Stack, Typography } from "@mui/material";
import { AiOutlineStock } from "react-icons/ai";
import { BsCurrencyExchange } from "react-icons/bs";
import { colors } from "../constants";

type StockUnitsOverviewProps = {
  totalUnits: number;
  vestedUnits: number;
  totalGrantsValue: number;
  vestedInrValue: number;
  usdToInr: number;
  stockPrice: number;
};

type StockUnitItemProps = {
  label: string;
  value: number;
};

type StockUnitFooterProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-IN").format(num);

const StockUnitItem = ({ label, value }: StockUnitItemProps) => (
  <Grid item xs={12} sm={6}>
    <Box p={2} bgcolor={colors.lightGrey} borderRadius={2}>
      <Typography fontSize={14} color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600} fontSize={18}>
        {formatNumber(value)}
      </Typography>
    </Box>
  </Grid>
);

const StockUnitFooter = ({ icon, label, value }: StockUnitFooterProps) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    {icon}
    <Stack gap={0.5} textAlign={"center"}>
      <Typography color="white" fontWeight={500}>
        {label}
      </Typography>
      <Typography color="white" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  </Stack>
);

const StockUnitsOverview = ({
  totalUnits,
  vestedUnits,
  totalGrantsValue,
  vestedInrValue,
  usdToInr,
  stockPrice,
}: StockUnitsOverviewProps) => {
  return (
    <Box p={3} borderRadius={2} bgcolor={colors.white}>
      <Typography fontWeight={600} mb={2} fontSize="1.1rem">
        Stock Units Overview
      </Typography>

      <Grid container spacing={2} mb={2}>
        <StockUnitItem label="Total units" value={totalUnits} />
        <StockUnitItem label="Vested Units" value={vestedUnits} />
        <StockUnitItem label="Total Grants Value" value={totalGrantsValue} />
        <StockUnitItem label="Vested Value" value={vestedInrValue} />
      </Grid>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        bgcolor={colors.black}
        p={2}
        borderRadius={2}
      >
        <StockUnitFooter
          icon={<BsCurrencyExchange color={colors.white} fontSize={20} />}
          label="USD/INR"
          value={`$1 = ₹${usdToInr}`}
        />
        <StockUnitFooter
          icon={<AiOutlineStock color={colors.white} fontSize={20} />}
          label="Stock Price"
          value={`$${stockPrice}`}
        />
      </Stack>
    </Box>
  );
};

export default StockUnitsOverview;
