import { Stack, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

const ActionCell = ({ onEdit, onDelete }: Props) => {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <IconButton onClick={onEdit} size="small">
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={onDelete} size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};

export default ActionCell;
