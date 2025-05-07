import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { screenSize } from "../constants";
import { DELETE_RSU } from "../graphql/mutations";
import { useGrantDialog } from "../context/GrantDialogContext";

const DeleteGrantConfirmationDialog = ({
  onDeleted,
  grantTitle,
}: {
  onDeleted: () => void;
  grantTitle: string | null;
}) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { deleteGrantId, closeDeleteConfirm } = useGrantDialog();

  const [deleteRsu, { loading }] = useMutation(DELETE_RSU);

  const handleConfirmDelete = async () => {
    if (!deleteGrantId) return;
    try {
      await deleteRsu({ variables: { id: deleteGrantId } });
      onDeleted?.();
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      closeDeleteConfirm();
    }
  };

  return (
    <Dialog
      open={!!deleteGrantId}
      onClose={closeDeleteConfirm}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        style: {
          borderRadius: isTablet ? 0 : 24,
        },
      }}
    >
      <DialogTitle>
        <Typography fontWeight={700} fontSize={20}>
          Delete Grant?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the grant dated{" "}
          <strong>{grantTitle}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={closeDeleteConfirm} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirmDelete}
          disabled={loading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteGrantConfirmationDialog;
