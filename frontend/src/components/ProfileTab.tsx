import {
  Avatar,
  Paper,
  Popper,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Divider,
} from "@mui/material";
import React from "react";
import { colors, ROUTES, screenSize } from "../constants";
import { capitalizeFirstLetter, getInitials } from "../utils";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, PersonOutlined } from "@mui/icons-material";
import { CgFileDocument } from "react-icons/cg";
import client from "../apolloClient";
import { FaCalculator } from "react-icons/fa6";
import { PiCurrencyInrFill } from "react-icons/pi";

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  popperRef: React.RefObject<HTMLDivElement>;
  handleClose: () => void;
};

const ProfileTab = ({ open, anchorEl, popperRef, handleClose }: Props) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const handleLogout = () => {
    client.clearStore();
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
      <Paper
        ref={popperRef}
        sx={{ boxShadow: 3, mt: 1, mb: isTablet ? 1 : 0, width: "290px" }}
      >
        <Stack spacing={1}>
          <Stack gap={1.25} direction={"row"} alignItems={"center"} p={2}>
            <Avatar
              sx={{
                width: "45px",
                height: "45px",
                fontSize: "16px",
                fontWeight: 500,
                backgroundColor: colors.mediumSlateIndigo,
                color: colors.white,
              }}
            >
              {getInitials(user?.username)}
            </Avatar>
            <Stack>
              <Typography variant="h6" fontSize={15}>
                {capitalizeFirstLetter(user?.username)}
              </Typography>
              <Typography fontSize={14} color={colors.contentTertiary}>
                {user?.email}
              </Typography>
            </Stack>
          </Stack>

          <List
            component="nav"
            sx={{
              p: 0,
              "& .MuiListItemIcon-root": {
                minWidth: 32,
                color: colors.black,
              },
            }}
          >
            <ListItemButton
              onClick={() => {
                navigate(ROUTES.PROFILE);
                handleClose();
              }}
            >
              <ListItemIcon>
                <PersonOutlined />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <Divider sx={{ my: 0.5, mx: 1 }} />
            <ListItemButton
              onClick={() => {
                navigate(ROUTES.MANAGE_GRANTS);
                handleClose();
              }}
            >
              <ListItemIcon>
                <CgFileDocument fontSize={18} />
              </ListItemIcon>
              <ListItemText primary="Manage Grants" />
            </ListItemButton>
            <Divider sx={{ my: 0.5, mx: 1 }} />
            <ListItemButton
              onClick={() => {
                navigate(ROUTES.PAYLENS);
                handleClose();
              }}
            >
              <ListItemIcon>
                <FaCalculator fontSize={18} />
              </ListItemIcon>
              <ListItemText primary="Paylens" />
            </ListItemButton>
            <Divider sx={{ my: 0.5, mx: 1 }} />
            <ListItemButton
              onClick={() => {
                navigate(ROUTES.MY_EARNINGS);
                handleClose();
              }}
            >
              <ListItemIcon>
                <PiCurrencyInrFill fontSize={20} />
              </ListItemIcon>
              <ListItemText primary="My Earnings" />
            </ListItemButton>
            <Divider sx={{ my: 0.5, mx: 1 }} />
            <ListItemButton
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Stack>
      </Paper>
    </Popper>
  );
};

export default ProfileTab;
