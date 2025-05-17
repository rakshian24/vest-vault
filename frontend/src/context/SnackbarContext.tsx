// SnackbarContext.tsx
import React, { createContext, useContext, useState } from "react";
import CustomSnackBar from "../components/CustomSnackBar";

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const showSuccess = (msg: string) => {
    setMessage(msg);
    setSeverity("success");
    setOpen(true);
  };

  const showError = (msg: string) => {
    setMessage(msg);
    setSeverity("error");
    setOpen(true);
  };

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError }}>
      {children}
      <CustomSnackBar
        open={open}
        onClose={handleClose}
        message={message}
        severity={severity}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
