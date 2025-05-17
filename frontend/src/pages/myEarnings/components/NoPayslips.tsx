import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import Button from "../../../components/CustomButton";
import { AddOutlined } from "@mui/icons-material";
import { colors, screenSize } from "../../../constants";
import { FaRegFolderOpen } from "react-icons/fa6";
import { useGrantDialog } from "../../../context/GrantDialogContext";
import { GET_MY_RSUS } from "../../../graphql/queries";
import { useQuery } from "@apollo/client";
import UploadPayslipForm from "./UploadPayslipForm";

type Props = {
  handleUpload: (file: File) => void;
};

const NoPayslips = ({ handleUpload }: Props) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  return (
    <Stack sx={{ margin: "auto", display: "flex", alignItems: "center" }}>
      <Stack
        p={isTablet ? 4 : 8}
        bgcolor={colors.white}
        gap={4}
        textAlign={"center"}
        borderRadius={4}
        width={isTablet ? "fit-content" : "500px"}
      >
        <Stack gap={2}>
          <Stack gap={2} alignItems={"center"}>
            <FaRegFolderOpen
              fontSize={isTablet ? 50 : 100}
              color={colors.slateGrey}
            />
            <Typography variant={isTablet ? "h6" : "h5"}>
              No Payslips Uploaded Yet
            </Typography>
          </Stack>
          <Typography
            color={colors.contentSecondary}
            sx={{ whiteSpace: "pre-line", textAlign: "center" }}
          >
            Start by uploading your payslips{"\n"}using the button below
          </Typography>
        </Stack>
        <Box>
          <UploadPayslipForm onUpload={handleUpload} />
        </Box>
      </Stack>
    </Stack>
  );
};

export default NoPayslips;
