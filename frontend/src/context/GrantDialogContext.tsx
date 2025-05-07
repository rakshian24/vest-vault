import { createContext, useContext, useState, ReactNode } from "react";
import AddGrantDialog from "../pages/dashboard/components/AddGrantDialog";
import { IRsuData } from "../components/VestingSchedule/types";
import DeleteGrantConfirmationDialog from "../components/DeleteGrantConfirmationDialog";

interface GrantDialogContextType {
  openGrantDialog: (editGrant?: IRsuData) => void;
  closeGrantDialog: () => void;
  isOpen: boolean;
  setOnCreated: (cb: () => void) => void;
  editGrant?: IRsuData;
  openDeleteConfirm: (grantId: string, grantTitle: string) => void;
  closeDeleteConfirm: () => void;
  deleteGrantId: string | null;
  setOnDeleted: (cb: () => void) => void;
  deleteGrantTitle: string | null;
}

const GrantDialogContext = createContext<GrantDialogContextType | undefined>(
  undefined
);

export const GrantDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onCreated, setOnCreated] = useState<() => void>(() => {});
  const [editGrant, setEditGrant] = useState<IRsuData | undefined>(undefined);
  const [deleteGrantId, setDeleteGrantId] = useState<string | null>(null);
  const [onDeleted, setOnDeleted] = useState<() => void>(() => {});
  const [deleteGrantTitle, setDeleteGrantTitle] = useState<string | null>(null);

  const openDeleteConfirm = (id: string, grantTitle: string) => {
    setDeleteGrantId(id);
    setDeleteGrantTitle(grantTitle);
  };
  const closeDeleteConfirm = () => {
    setDeleteGrantId(null);
    setDeleteGrantTitle(null);
  };

  const openGrantDialog = (grant?: IRsuData) => {
    setEditGrant(grant);
    setIsOpen(true);
  };
  const closeGrantDialog = () => {
    setEditGrant(undefined);
    setIsOpen(false);
  };

  return (
    <GrantDialogContext.Provider
      value={{
        isOpen,
        openGrantDialog,
        closeGrantDialog,
        setOnCreated,
        editGrant,
        openDeleteConfirm,
        closeDeleteConfirm,
        deleteGrantId,
        setOnDeleted,
        deleteGrantTitle,
      }}
    >
      {children}
      <AddGrantDialog
        open={isOpen}
        handleClose={closeGrantDialog}
        onGrantCreated={() => {
          onCreated?.();
          closeGrantDialog();
        }}
        grantToEdit={editGrant}
      />
      <DeleteGrantConfirmationDialog
        onDeleted={onDeleted}
        grantTitle={deleteGrantTitle}
      />
    </GrantDialogContext.Provider>
  );
};

export const useGrantDialog = () => {
  const context = useContext(GrantDialogContext);
  if (!context) {
    throw new Error("useGrantDialog must be used within a GrantDialogProvider");
  }
  return context;
};
