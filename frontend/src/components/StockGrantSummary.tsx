import dayjs from "dayjs";
import { colors, screenSize } from "../constants";
import { useCurrency } from "../context/currencyContext";
import { IRsuData } from "./VestingSchedule/types";
import {
  Box,
  Divider,
  Stack,
  SxProps,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRsuSummary } from "../hooks/useStockGrantSummaryHooks";
import { BsFillBoxFill, BsGraphUpArrow, BsCalendarDate } from "react-icons/bs";
import { RiCoinsFill } from "react-icons/ri";
import { ImRoad } from "react-icons/im";
import {
  formatCompactNumber,
  formatNumber,
  getUnitsInPipeline,
} from "../utils";
import TapTooltip from "./TapToolTip";

type Props = {
  rsuData: IRsuData[];
  forexStockPrice: number;
};

type Row = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  showTooltip?: boolean;
};

type StockGrantSummaryRowProps = {
  label: string;
  value: string;
  sx?: SxProps;
  icon?: React.ReactNode;
  showTooltip?: boolean;
  tooltipValue?: number;
  symbol?: string;
  isUSD?: boolean;
};

const StockGrantSummaryRow = ({
  label,
  value,
  sx,
  icon,
  showTooltip,
  tooltipValue,
  symbol,
  isUSD = true,
}: StockGrantSummaryRowProps) => (
  <Box px={3} py={2} bgcolor={"white"} sx={{ ...sx }}>
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{ ...sx }}
    >
      <Typography
        fontWeight={600}
        fontSize={"0.95rem"}
        color={colors.contentSecondary}
      >
        {label}
      </Typography>
      <Stack direction={"row"} alignItems={"center"} gap={1.5}>
        {showTooltip && tooltipValue !== undefined && symbol ? (
          <TapTooltip
            value={`${symbol} ${formatCompactNumber(tooltipValue, isUSD)}`}
            tooltip={`${symbol} ${formatNumber(tooltipValue, isUSD)}`}
            sx={{
              fontWeight: "600",
              fontSize: "0.95rem",
              color: colors.contentSecondary,
            }}
          />
        ) : (
          <Typography
            fontWeight={600}
            fontSize={"0.95rem"}
            color={colors.contentSecondary}
          >
            {value}
          </Typography>
        )}
        {icon}
      </Stack>
    </Stack>
  </Box>
);

const StockGrantSummary = ({ rsuData, forexStockPrice }: Props) => {
  const { symbol, isUSD } = useCurrency();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { unvestedUnits, annualIncome, nextVestingDate, unitsByYear } =
    useRsuSummary(rsuData, forexStockPrice, dayjs());

  const rows: Row[] = [
    {
      label: "Total Unvested Units",
      value: `${unvestedUnits}`,
      icon: <BsFillBoxFill color={colors.mediumSlateIndigo} />,
    },
    {
      label: "Est. Value",
      value: `${symbol} ${formatCompactNumber(
        unvestedUnits * forexStockPrice,
        isUSD
      )}`,
      icon: <RiCoinsFill color={colors.mediumSlateIndigo} />,
      showTooltip: true,
    },
    {
      label: "Annual Vesting Income",
      value: `${symbol} ${formatCompactNumber(annualIncome, isUSD)}`,
      icon: <BsGraphUpArrow color={colors.mediumSlateIndigo} />,
      showTooltip: true,
    },
    {
      label: "Next Vesting Date",
      value: `${nextVestingDate}`,
      icon: <BsCalendarDate color={colors.mediumSlateIndigo} />,
    },
    {
      label: "Units In Pipeline",
      value: getUnitsInPipeline(unitsByYear),
      icon: <ImRoad color={colors.mediumSlateIndigo} />,
    },
  ];

  return (
    <Box borderRadius={isTablet ? 5 : 2} bgcolor={colors.white}>
      <Box p={3}>
        <Typography fontWeight={600} fontSize="1.2rem">
          Stock Grant Summary
        </Typography>
      </Box>
      <Divider
        sx={{
          height: "0.1px",
          borderColor: colors.lightGrey3,
          borderBottomWidth: "1px",
        }}
      />
      <Box
        sx={{
          borderBottomLeftRadius: isTablet ? 5 : 2,
          borderBottomRightRadius: isTablet ? 5 : 2,
        }}
      >
        {rows.map((row, idx) => (
          <Box key={row.label}>
            <StockGrantSummaryRow
              label={row.label}
              value={row.value}
              icon={row.icon}
              showTooltip={row.showTooltip}
              tooltipValue={
                row.label === "Est. Value"
                  ? unvestedUnits * forexStockPrice
                  : row.label === "Annual Vesting Income"
                  ? annualIncome
                  : undefined
              }
              symbol={symbol}
              isUSD={isUSD}
              sx={
                idx === rows.length - 1
                  ? {
                      borderBottomLeftRadius: isTablet ? 20 : 8,
                      borderBottomRightRadius: isTablet ? 20 : 8,
                    }
                  : undefined
              }
            />
            {idx !== rows.length - 1 && (
              <Divider
                sx={{
                  height: 0.1,
                  borderColor: colors.lightGrey3,
                  borderBottomWidth: "1px",
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StockGrantSummary;
