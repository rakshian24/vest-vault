import { createContext, useContext, useState, ReactNode } from "react";
import AddGrantDialog from "../pages/dashboard/components/AddGrantDialog";

interface GrantDialogContextType {
  openGrantDialog: () => void;
  closeGrantDialog: () => void;
  isOpen: boolean;
  setOnCreated: (cb: () => void) => void;
}

const GrantDialogContext = createContext<GrantDialogContextType | undefined>(
  undefined
);

export const GrantDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onCreated, setOnCreated] = useState<() => void>(() => {});

  const openGrantDialog = () => setIsOpen(true);
  const closeGrantDialog = () => setIsOpen(false);

  return (
    <GrantDialogContext.Provider
      value={{
        isOpen,
        openGrantDialog,
        closeGrantDialog,
        setOnCreated,
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
