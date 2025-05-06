import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { colors, screenSize } from "../../constants";

type GrantYearColorLegendProps = {
  uniqueGrantDates: string[];
  grantDateColorMap: Record<string, string>;
};

type LegendProps = {
  uniqueGrantDates: string[];
  grantDateColorMap: Record<string, string>;
  isMobileDevice?: boolean;
};

const Legend = ({
  uniqueGrantDates,
  grantDateColorMap,
  isMobileDevice = false,
}: LegendProps) => (
  <Box px={isMobileDevice ? 0 : 2} py={isMobileDevice ? 1.5 : 2}>
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        rowGap: 1.5,
        alignItems: "center",
      }}
    >
      {uniqueGrantDates.map((date) => (
        <Stack
          key={date}
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ minWidth: "fit-content" }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: isMobileDevice ? "50%" : 1,
              backgroundColor: grantDateColorMap[date],
              border: `1px solid ${colors.lightGrey1}`,
            }}
          />
          <Typography variant="body2">
            {dayjs(date).format("MMM YYYY")}
          </Typography>
        </Stack>
      ))}
    </Box>
  </Box>
);

const GrantYearColorLegend = ({
  uniqueGrantDates,
  grantDateColorMap,
}: GrantYearColorLegendProps) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  return (
    <>
      {isTablet ? (
        <Stack
          bgcolor={colors.lightGrey3}
          px={1.5}
          my={2}
          gap={0.5}
          py={2}
          borderRadius={3}
        >
          <Typography fontSize={"1rem"} fontWeight={500}>
            Grant year legend:
          </Typography>
          <Legend
            uniqueGrantDates={uniqueGrantDates}
            grantDateColorMap={grantDateColorMap}
            isMobileDevice
          />
        </Stack>
      ) : (
        <Legend
          uniqueGrantDates={uniqueGrantDates}
          grantDateColorMap={grantDateColorMap}
        />
      )}
    </>
  );
};

export default GrantYearColorLegend;
