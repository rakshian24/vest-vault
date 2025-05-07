import { createContext, useContext, useState, ReactNode } from "react";
import AddGrantDialog from "../pages/dashboard/components/AddGrantDialog";
import { IRsuData } from "../components/VestingSchedule/types";

interface GrantDialogContextType {
  openGrantDialog: (editGrant?: IRsuData) => void;
  closeGrantDialog: () => void;
  isOpen: boolean;
  setOnCreated: (cb: () => void) => void;
  editGrant?: IRsuData;
}

const GrantDialogContext = createContext<GrantDialogContextType | undefined>(
  undefined
);

export const GrantDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onCreated, setOnCreated] = useState<() => void>(() => {});
  const [editGrant, setEditGrant] = useState<IRsuData | undefined>(undefined);

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
