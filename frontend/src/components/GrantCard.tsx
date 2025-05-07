import { Box, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { colors } from "../constants";
import { useCurrency } from "../context/currencyContext";
import { formatNumber } from "../utils";

type GrantCardProps = {
  dateLabel: string;
  rsuCount: number;
  onEdit: () => void;
  onDelete: () => void;
  forexValue: number;
  grantAmount: number;
};

const GrantCard = ({
  dateLabel,
  rsuCount,
  onEdit,
  onDelete,
  forexValue,
  grantAmount,
}: GrantCardProps) => {
  const { symbol, isUSD } = useCurrency();

  return (
    <Box
      sx={{
        bgcolor: colors.white,
        borderRadius: 3,
        p: 2,
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
        border: `1px solid ${colors.lightGrayishBlue}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack gap={1}>
        <Typography fontWeight={700} fontSize="1rem" color="#1A1A1A">
          {dateLabel}
        </Typography>
        <Stack direction={"row"} alignItems={"center"}>
          <Typography
            fontWeight={600}
            fontSize="0.95rem"
            color={colors.mediumSlateIndigo}
          >
            {rsuCount} RSUs
          </Typography>
          <Box mx={1}>|</Box>
          <Typography fontWeight={600} fontSize="0.95rem" color="#00C49A">
            {`${symbol} ${formatNumber(grantAmount * forexValue, isUSD)}`}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1}>
        <IconButton onClick={onEdit} size="small" sx={{ color: "#7F8FA4" }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={onDelete} size="small" sx={{ color: "#7F8FA4" }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default GrantCard;
