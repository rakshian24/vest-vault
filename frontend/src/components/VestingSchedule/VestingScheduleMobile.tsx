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
import { colors } from "../../constants";
import { formatNumber } from "../../utils";
import { IRsuData } from "./types";
import { useCurrency } from "../../context/currencyContext";
import { FaArrowRight } from "react-icons/fa6";

type Props = {
  rsuData: IRsuData[];
  forexStockPrice: number;
};

const VestingScheduleMobile = ({ rsuData, forexStockPrice }: Props) => {
  const { symbol, isUSD } = useCurrency();

  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>(
    {}
  );

  const groupedByYear: Record<string, any[]> = {};

  rsuData.forEach((rsu) => {
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
    <Stack spacing={2}>
      <Typography fontWeight={600} mb={1} fontSize="1.1rem">
        Vesting Schedule
      </Typography>
      {Object.entries(groupedByYear).map(([year, events]) => {
        const yearGrantUnits = events.reduce((sum, e) => sum + e.grantedQty, 0);
        const yearVestedUnits = events.reduce((sum, e) => sum + e.vestedQty, 0);

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
                    <Box borderRadius={2} px={2} py={1.5} bgcolor={"white"}>
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        display={"flex"}
                        alignItems={"center"}
                      >
                        <Typography
                          fontWeight={600}
                          fontSize={17}
                          color={colors.contentSecondary}
                        >
                          {dayjs(event.vestDate).format("MMM D")}
                        </Typography>
                        <Stack spacing={0}>
                          <Typography
                            fontSize={16}
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
                            fontSize={16}
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
                          fontSize={16}
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
                          fontSize={16}
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
  );
};

export default VestingScheduleMobile;
