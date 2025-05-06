import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Stack,
  Typography,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import {
  colors,
  grantYearColorPaletteForDesktop,
  ISO_DATE_FORMAT,
  screenSize,
} from "../../constants";
import { useCurrency } from "../../context/currencyContext";
import { formatNumber } from "../../utils";
import GrantYearColorLegend from "./GrantYearColorLegend";
import { IRsuData } from "./types";

type VestingScheduleProps = {
  rsuData: IRsuData[];
  forexStockPrice: number;
};

// 40 px for the chevron, then five equal columns for the numbers
const GRID_TEMPLATE = "40px repeat(5, 1fr)";
const CELL_SX = { textAlign: "center" };

type PrimaryHeaderProps = {
  label: string;
};

const PrimaryHeader = ({ label }: PrimaryHeaderProps) => (
  <Typography sx={CELL_SX} fontWeight={600} fontSize={"18px"}>
    {label}
  </Typography>
);

type SecondaryHeaderProps = {
  label: string;
};

const SecondaryHeader = ({ label }: SecondaryHeaderProps) => (
  <Typography sx={{ flex: 1, fontWeight: 600 }}>{label}</Typography>
);

const VestingSchedule = ({
  rsuData,
  forexStockPrice,
}: VestingScheduleProps) => {
  const { symbol, isUSD } = useCurrency();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  if (rsuData.length <= 0) return null;

  const groupedRsusByYear: Record<string, any[]> = {};

  rsuData.forEach((rsu) => {
    rsu.vestingSchedule.forEach((event) => {
      const year = new Date(event.vestDate).getFullYear();

      if (!groupedRsusByYear[year]) {
        groupedRsusByYear[year] = [];
      }

      groupedRsusByYear[year].push({
        ...event,
        grantDate: rsu.grantDate,
      });
    });
  });

  const grantDateColorMap: Record<string, string> = {};
  const uniqueGrantDates = Array.from(
    new Set(
      rsuData.flatMap((rsu) => rsu.vestingSchedule.map(() => rsu.grantDate))
    )
  );

  uniqueGrantDates.forEach((date, index) => {
    grantDateColorMap[date] =
      grantYearColorPaletteForDesktop[index % grantYearColorPaletteForDesktop.length];
  });

  return (
    <Box borderRadius={isTablet ? 5 : 2}>
      <Typography
        variant="h6"
        fontWeight={600}
        bgcolor={colors.charcoalNavy}
        color={colors.white}
        p={2}
        sx={{
          borderTopLeftRadius: isTablet ? 20 : 8,
          borderTopRightRadius: isTablet ? 20 : 8,
        }}
      >
        Vesting Schedule
      </Typography>

      <GrantYearColorLegend
        uniqueGrantDates={uniqueGrantDates}
        grantDateColorMap={grantDateColorMap}
      />

      <Box
        sx={{
          p: 2,
          display: "grid",
          gridTemplateColumns: GRID_TEMPLATE,
          alignItems: "center",
          boxShadow: "rgba(99,99,99,0.2) 0px 2px 8px 0px",
          bgcolor: colors.darkGrey1,
          fontWeight: 600,
          fontSize: "18px",
        }}
      >
        {/* empty cell to align with ExpandMoreIcon below */}
        <Box />
        <PrimaryHeader label="Year" />
        <PrimaryHeader label="Units" />
        <PrimaryHeader label="Stock Price" />
        <PrimaryHeader label="Granted Value" />
        <PrimaryHeader label="Vested Value" />
      </Box>

      {Object.entries(groupedRsusByYear).map(([year, schedule]) => {
        const yearGrantUnits = schedule.reduce(
          (acc, e) => acc + e.grantedQty,
          0
        );

        const yearVestedUnits = schedule.reduce(
          (acc, e) => acc + e.vestedQty,
          0
        );

        const yearGrantedValue = yearGrantUnits * forexStockPrice;
        const yearVestedValue = yearVestedUnits * forexStockPrice;

        return (
          <Accordion
            key={year}
            sx={{
              boxShadow: "none",
              "&.Mui-expanded": {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={null}
              sx={{
                p: 0,
                boxShadow: 1,
                my: 0,
                "&.MuiAccordionSummary-root": {
                  minHeight: "60px",
                },
                "&.Mui-expanded": {
                  minHeight: "60px",
                },
                "& .MuiAccordionSummary-content": {
                  margin: 0,
                },
                "& .MuiAccordionSummary-content.Mui-expanded": {
                  margin: 0,
                },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: GRID_TEMPLATE,
                  alignItems: "center",
                }}
              >
                <ExpandMoreIcon sx={{ justifySelf: "center" }} />
                <Typography sx={{ ...CELL_SX, fontWeight: 600 }}>
                  {year}
                </Typography>
                <Typography sx={CELL_SX}>{yearGrantUnits}</Typography>
                <Typography sx={CELL_SX}>
                  {`${symbol} ${formatNumber(forexStockPrice, isUSD)}`}
                </Typography>
                <Typography sx={CELL_SX}>
                  {`${symbol} ${formatNumber(yearGrantedValue, isUSD)}`}
                </Typography>
                <Typography sx={CELL_SX}>
                  {`${symbol} ${formatNumber(yearVestedValue, isUSD)}`}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              <Stack
                direction="row"
                spacing={2}
                p={2}
                bgcolor="#F3F4F6"
                sx={{
                  fontWeight: 600,
                  textAlign: "center",
                  boxShadow: `rgba(99, 99, 99, 0.2) 0px 2px 8px 0px`,
                }}
              >
                <SecondaryHeader label="Vest Period" />
                <SecondaryHeader label="Vest Date" />
                <SecondaryHeader label="Granted Qty" />
                <SecondaryHeader label="Granted Value" />
                <SecondaryHeader label="Vested Qty" />
                <SecondaryHeader label="Vested Value" />
              </Stack>
              <Divider />

              {schedule.map((item, index) => (
                <Tooltip
                  key={item._id}
                  title={`Granted in ${dayjs(item.grantDate).year()}`}
                  arrow
                  placement="right"
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    p={2}
                    bgcolor={grantDateColorMap[item.grantDate]}
                    borderBottom={`1px solid ${colors.darkGrey3}`}
                    textAlign="center"
                  >
                    <Typography sx={{ flex: 1 }}>{index + 1}</Typography>
                    <Typography sx={{ flex: 1 }}>
                      {dayjs(item.vestDate).format(ISO_DATE_FORMAT)}
                    </Typography>
                    <Typography sx={{ flex: 1 }}>{item.grantedQty}</Typography>
                    <Typography sx={{ flex: 1 }}>{`${symbol} ${formatNumber(
                      item.grantedQty * forexStockPrice,
                      isUSD
                    )}`}</Typography>
                    <Typography sx={{ flex: 1 }}>{item.vestedQty}</Typography>
                    <Typography sx={{ flex: 1 }}>{`${symbol} ${formatNumber(
                      item.vestedQty * forexStockPrice,
                      isUSD
                    )}`}</Typography>
                  </Stack>
                </Tooltip>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default VestingSchedule;
