import { Box, Grid, Typography } from "@mui/material";
import { useCurrency } from "../../context/currencyContext";
import { formatNumber } from "../../utils";
import { colors } from "../../constants";

type StockUnitItemProps = {
  label: string;
  value: number;
  isCurrencyType?: boolean;
};

const StockUnitItem = ({
  label,
  value,
  isCurrencyType = false,
}: StockUnitItemProps) => {
  const { symbol, isUSD } = useCurrency();

  return (
    <Grid item xs={12} sm={6}>
      <Box p={2} bgcolor={colors.lightGrey} borderRadius={2}>
        <Typography fontSize={14} color="text.secondary">
          {label}
        </Typography>
        <Typography fontWeight={600} fontSize={18}>
          {isCurrencyType
            ? `${symbol} ${formatNumber(value, isUSD)}`
            : formatNumber(value, isUSD, false)}
        </Typography>
      </Box>
    </Grid>
  );
};

export default StockUnitItem;
