import { IconButton, useMediaQuery } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { colors, screenSize } from "../../../constants";

type Props = {
  onDelete: () => void;
};

const ActionCell = ({ onDelete }: Props) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  return (
    <IconButton
      onClick={onDelete}
      size="small"
      sx={{ bgcolor: colors.lightGrey }}
    >
      <DeleteIcon fontSize={isTablet ? "small" : "medium"} />
    </IconButton>
  );
};

export default ActionCell;
