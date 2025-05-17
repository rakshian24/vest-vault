import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  onDelete: () => void;
};

const ActionCell = ({ onDelete }: Props) => {
  return (
    <IconButton onClick={onDelete} size="small">
      <DeleteIcon />
    </IconButton>
  );
};

export default ActionCell;
