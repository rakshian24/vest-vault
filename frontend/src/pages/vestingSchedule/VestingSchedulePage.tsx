import {
  Box,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";
import dayjs from "dayjs";
import { FaArrowRight, FaChevronLeft } from "react-icons/fa6";
import { useCurrency } from "../../context/currencyContext";
import { colors, ROUTES } from "../../constants";
import { formatNumber } from "../../utils";
import { useQuery } from "@apollo/client";
import {
  GET_EXCHANGE_RATE,
  GET_MY_RSUS,
  GET_STOCK_PRICE,
} from "../../graphql/queries";
import CommonSkeleton from "../../components/CommonSkeleton";
import { IRsuData } from "../../components/VestingSchedule/types";
import { NavLink } from "react-router-dom";
import StockPrice from "../../components/StockPrice";

const VestingSchedulePage = () => {
  const { symbol, isUSD } = useCurrency();

  const { data, loading: isRsusLoading } = useQuery(GET_MY_RSUS);

  const { data: exchangeRateData, loading: isExchangeRateLoading } =
    useQuery(GET_EXCHANGE_RATE);

  const { data: stockPriceData, loading: isStockPriceLoading } = useQuery(
    GET_STOCK_PRICE,
    {
      variables: {
        symbol: "INTU",
      },
    }
  );

  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>(
    {}
  );

  if (isRsusLoading || isExchangeRateLoading || isStockPriceLoading) {
    return (
      <Stack>
        <CommonSkeleton height={300} sx={{ borderRadius: 6 }} />
      </Stack>
    );
  }

  const stockPrice = stockPriceData?.getStockPrice?.stockPriceInUSD;
  const usdToInrValue = exchangeRateData?.getExchangeRate?.usdToInr;
  const forexValue = isUSD ? 1 : usdToInrValue;
  const forexStockPrice = stockPrice * forexValue;

  const groupedByYear: Record<string, any[]> = {};

  data?.myRsus.forEach((rsu: IRsuData) => {
    rsu.vestingSchedule.forEach((event) => {
      const year = dayjs(event.vestDate).year().toString();
      if (!groupedByYear[year]) groupedByYear[year] = [];
      groupedByYear[year].push({ ...event, stockPrice: rsu.stockPrice });
    });
  });

  const handleToggle = (year: string) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  return (
    <Stack>
      <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <NavLink to={ROUTES.DASHBOARD}>
          <FaChevronLeft color={colors.contentTertiary} fontSize={"1.2rem"} />
        </NavLink>
        <Typography fontWeight={600} mb={1} fontSize="1.4rem">
          Vesting Schedule
        </Typography>
      </Stack>
      <Box sx={{ alignSelf: "flex-end", mb: 2 }}>
        <StockPrice
          value={`${symbol} ${formatNumber(forexStockPrice, isUSD)}`}
          color={colors.charcoalNavy}
          sx={{ m: 0 }}
        />
      </Box>
      <Stack spacing={2}>
        {Object.entries(groupedByYear).map(([year, events]) => {
          const yearGrantUnits = events.reduce(
            (sum, e) => sum + e.grantedQty,
            0
          );
          const yearVestedUnits = events.reduce(
            (sum, e) => sum + e.vestedQty,
            0
          );

          const yearGrantedValue = yearGrantUnits * forexStockPrice;
          const yearVestedValue = yearVestedUnits * forexStockPrice;

          return (
            <Box
              key={year}
              borderRadius={3}
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
              bgcolor="#fff"
              overflow="hidden"
            >
              <Stack
                bgcolor={colors.charcoalNavy}
                color={colors.white}
                px={2}
                py={1.5}
                onClick={() => handleToggle(year)}
              >
                <Stack
                  display={"flex"}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  width={"100%"}
                  mb={1}
                >
                  <Typography fontWeight={600} fontSize={"1.1rem"}>
                    {year}
                  </Typography>
                  <IconButton
                    sx={{ color: colors.lightGrey, flex: 0.1, p: 0, ml: 2 }}
                  >
                    {expandedYears[year] ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Stack>
                <Grid container spacing={2} width={"100%"}>
                  <Grid item xs={6} sm={6}>
                    <Stack gap={0.5}>
                      <Typography fontWeight={600} color={colors.lightGrey4}>
                        Granted units
                      </Typography>
                      <Box>
                        <Typography fontWeight={600} color={colors.white}>
                          {yearGrantUnits}
                        </Typography>
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color={colors.mediumSlateIndigo2}
                        >{`${symbol} ${formatNumber(
                          yearGrantedValue,
                          isUSD
                        )}`}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Stack gap={0.5}>
                      <Typography fontWeight={600} color={colors.lightGrey4}>
                        Vested units
                      </Typography>
                      <Box>
                        <Typography fontWeight={600} color={colors.white}>
                          {yearVestedUnits}
                        </Typography>
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color={colors.green1}
                        >{`${symbol} ${formatNumber(
                          yearVestedValue,
                          isUSD
                        )}`}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>

              <Collapse in={expandedYears[year]}>
                <Box>
                  {events.map((event) => (
                    <Box key={event._id}>
                      <Box
                        borderRadius={2}
                        px={2}
                        py={"10px"}
                        bgcolor={"white"}
                      >
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                          display={"flex"}
                          alignItems={"center"}
                        >
                          <Typography
                            fontWeight={600}
                            fontSize={"0.95rem"}
                            color={colors.contentSecondary}
                          >
                            {dayjs(event.vestDate).format("MMM D")}
                          </Typography>
                          <Stack spacing={0}>
                            <Typography
                              fontSize={"0.9rem"}
                              color={colors.mediumSlateIndigo}
                              fontWeight={600}
                              textAlign={"right"}
                            >
                              {`${symbol} ${formatNumber(
                                event.grantedQty * forexStockPrice,
                                isUSD
                              )}`}
                            </Typography>
                            <Typography
                              fontSize={"0.9rem"}
                              color={colors.green1}
                              fontWeight={600}
                              textAlign={"right"}
                            >
                              {`${symbol} ${formatNumber(
                                event.vestedQty * forexStockPrice,
                                isUSD
                              )}`}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={0.5}
                          display={"flex"}
                          alignItems={"center"}
                        >
                          <Typography
                            fontSize={"0.9rem"}
                            fontWeight={600}
                            color={colors.mediumSlateIndigo}
                          >
                            Granted: {event.grantedQty}
                          </Typography>
                          <FaArrowRight
                            color={colors.contentTertiary}
                            style={{ margin: "0 8px" }}
                          />
                          <Typography
                            fontSize={"0.9rem"}
                            fontWeight={600}
                            color={colors.green1}
                          >
                            Vested: {event.vestedQty}
                          </Typography>
                        </Stack>
                      </Box>
                      <Divider
                        sx={{
                          height: "0.1px",
                          borderColor: colors.lightGrey3,
                          borderBottomWidth: "1px",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default VestingSchedulePage;
