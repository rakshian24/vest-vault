import { Box, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { AiOutlineStock } from "react-icons/ai";
import { BsCurrencyExchange } from "react-icons/bs";
import { useCurrency } from "../../context/currencyContext";
import { colors, screenSize } from "../../constants";
import StockUnitItem from "./StockUnitItem";
import StockUnitFooter from "./StockUnitFooter";
import { formatNumber } from "../../utils";

type StockUnitsOverviewProps = {
  totalUnits: number;
  vestedUnits: number;
  totalGrantsValue: number;
  vestedInrValue: number;
  usdToInr: number;
  stockPrice: number;
};

const StockUnitsOverview = ({
  totalUnits,
  vestedUnits,
  totalGrantsValue,
  vestedInrValue,
  usdToInr,
  stockPrice,
}: StockUnitsOverviewProps) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { symbol, isUSD } = useCurrency();

  return (
    <Box p={3} borderRadius={isTablet ? 5 : 2} bgcolor={colors.white}>
      <Typography fontWeight={600} mb={2} fontSize="1.1rem">
        Stock Units Overview
      </Typography>

      <Grid container spacing={2} mb={2}>
        <StockUnitItem label="Total units" value={totalUnits} />
        <StockUnitItem label="Vested Units" value={vestedUnits} />
        <StockUnitItem
          label="Total Grants Value"
          value={totalGrantsValue}
          isCurrencyType
        />
        <StockUnitItem
          label="Vested Value"
          value={vestedInrValue}
          isCurrencyType
        />
      </Grid>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        bgcolor={colors.charcoalNavy}
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
          value={`${symbol} ${formatNumber(stockPrice, isUSD)}`}
        />
      </Stack>
    </Box>
  );
};

export default StockUnitsOverview;
