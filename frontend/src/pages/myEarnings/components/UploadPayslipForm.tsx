import { useRef } from "react";
import Button from "../../../components/CustomButton";
import { Box } from "@mui/material";
import { UploadSharp } from "@mui/icons-material";
import { colors } from "../../../constants";

type Props = {
  onUpload: (file: File) => void;
};

const UploadPayslipForm = ({ onUpload }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onUpload(selectedFile);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*,.pdf"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Box sx={{ alignSelf: "flex-end" }}>
        <Button
          onClick={handleButtonClick}
          buttonText="Upload Payslip"
          startIcon={<UploadSharp />}
          styles={{
            bgcolor: colors.mediumSlateIndigo,
            color: colors.white,
            "&:hover": {
              bgcolor: colors.mediumSlateIndigo2,
              boxShadow: "none",
            },
          }}
        />
      </Box>
    </>
  );
};

export default UploadPayslipForm;
