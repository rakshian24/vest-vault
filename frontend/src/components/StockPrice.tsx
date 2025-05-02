import { Stack, SxProps, Typography } from "@mui/material";
import { AiOutlineStock } from "react-icons/ai";
import { colors } from "../constants";

type StockUnitFooterProps = {
  value: string;
  color?: string;
  sx?: SxProps;
};

const StockPrice = ({
  value,
  color = colors.white,
  sx,
}: StockUnitFooterProps) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ ...sx }}>
    <AiOutlineStock color={color} fontSize={20} />
    <Stack gap={0.5} textAlign={"center"}>
      <Typography color={color} fontWeight={500}>
        Stock Price
      </Typography>
      <Typography color={color} fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  </Stack>
);

export default StockPrice;
