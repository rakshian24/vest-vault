import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import Button from "../../../components/CustomButton";
import { AddOutlined } from "@mui/icons-material";
import { colors, screenSize } from "../../../constants";
import { FaRegFolderOpen } from "react-icons/fa6";
import { useGrantDialog } from "../../../context/GrantDialogContext";
import { GET_MY_RSUS } from "../../../graphql/queries";
import { useQuery } from "@apollo/client";

type Props = {};

const NoGrants = (props: Props) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { openGrantDialog, setOnCreated } = useGrantDialog();
  const { refetch } = useQuery(GET_MY_RSUS);

  return (
    <Stack sx={{ margin: "auto" }}>
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
              No Grants Added Yet
            </Typography>
          </Stack>
          <Typography
            color={colors.contentSecondary}
            sx={{ whiteSpace: "pre-line", textAlign: "center" }}
          >
            Start by adding your first stock grant{"\n"}using the button below
          </Typography>
        </Stack>
        <Box>
          <Button
            buttonText="Add Your First Grant"
            startIcon={<AddOutlined />}
            onClick={() => {
              setOnCreated(() => () => refetch());
              openGrantDialog();
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default NoGrants;
