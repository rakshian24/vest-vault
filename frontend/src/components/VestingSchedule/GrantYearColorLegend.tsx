import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { colors } from "../../constants";

type Props = {
  uniqueGrantDates: string[];
  grantDateColorMap: Record<string, string>;
};

const GrantYearColorLegend = ({
  uniqueGrantDates,
  grantDateColorMap,
}: Props) => {
  return (
    <Box p={2}>
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
                borderRadius: 1,
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
};

export default GrantYearColorLegend;
