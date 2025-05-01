import { Stack, Typography } from "@mui/material";

type StockUnitFooterProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const StockUnitFooter = ({ icon, label, value }: StockUnitFooterProps) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    {icon}
    <Stack gap={0.5} textAlign={"center"}>
      <Typography color="white" fontWeight={500}>
        {label}
      </Typography>
      <Typography color="white" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  </Stack>
);

export default StockUnitFooter;
