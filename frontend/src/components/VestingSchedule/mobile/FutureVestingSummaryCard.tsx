import { Box, Divider, Stack, Typography } from "@mui/material";
import { colors, ROUTES } from "../../../constants";
import { formatNumber } from "../../../utils";
import { FaChevronRight } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

type VestEvent = {
  grantedQty: number;
};

interface Props {
  futureYears: string[];
  groupedByYear: Record<string, VestEvent[]>;
  forexStockPrice: number;
  symbol: string;
  isUSD: boolean;
}

const FutureVestingSummaryCard = ({
  futureYears,
  groupedByYear,
  forexStockPrice,
  symbol,
  isUSD,
}: Props) => {
  if (futureYears.length === 0) return null;

  const firstYear = futureYears[0];
  const lastYear = futureYears[futureYears.length - 1];

  return (
    <Box
      borderRadius={3}
      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
      bgcolor="#fff"
      overflow="hidden"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1.5}
      >
        <Typography fontWeight={600} fontSize="1.1rem">
          {`${firstYear}-${lastYear}`}
        </Typography>
        <NavLink to={ROUTES.VESTING_SCHEDULE}>
          <FaChevronRight color={colors.contentTertiary} />
        </NavLink>
      </Stack>

      {futureYears.map((year, idx) => {
        const events = groupedByYear[year] || [];
        const units = events.reduce((s, e) => s + e.grantedQty, 0);
        const value = units * forexStockPrice;

        return (
          <Box key={year}>
            <Box px={2} py={1.2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={500} color={colors.contentSecondary}>
                  {year}
                </Typography>

                <Typography fontWeight={500} color={colors.black}>
                  {`${units} Units`}
                </Typography>

                <Typography fontWeight={600} color={colors.mediumSlateIndigo}>
                  {`${symbol} ${formatNumber(value, isUSD)}`}
                </Typography>
              </Stack>
            </Box>

            {idx !== futureYears.length - 1 && (
              <Divider
                sx={{
                  height: 0.1,
                  borderColor: colors.lightGrey3,
                  borderBottomWidth: "1px",
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default FutureVestingSummaryCard;
