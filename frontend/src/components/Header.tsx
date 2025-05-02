import React, { useState, useRef } from "react";
import {
  Avatar,
  Box,
  Stack,
  ClickAwayListener,
  Typography,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { colors, screenSize } from "../constants";
import { getInitials } from "../utils";
import ProfileTab from "./ProfileTab";
import { FaVault } from "react-icons/fa6";
import Button from "./CustomButton";
import { AddOutlined } from "@mui/icons-material";
import { useQuery } from "@apollo/client";
import { GET_MY_RSUS } from "../graphql/queries";
import CustomToggleSwitch from "./CustomToggleSwitch";
import { useCurrency } from "../context/currencyContext";
import { useGrantDialog } from "../context/GrantDialogContext";
import { RiMenu3Line } from "react-icons/ri";

const Header = () => {
  const { user } = useAuth();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { openGrantDialog, setOnCreated } = useGrantDialog();
  const { refetch } = useQuery(GET_MY_RSUS);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (popperRef.current && popperRef.current.contains(event.target as Node)) {
      return;
    }
    handleClose();
  };

  const open = Boolean(anchorEl);

  const { toggleCurrency, isUSD } = useCurrency();

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        px: 2,
        py: 2,
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px;",
        position: "sticky",
        bgcolor: colors.charcoalNavy,
      }}
    >
      <Link to={"/"}>
        <Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <FaVault
              size={isTablet ? 30 : 35}
              color={colors.mediumSlateIndigo}
            />
            <Typography variant="h5" fontWeight="bold" color={colors.white}>
              VestVault
            </Typography>
          </Box>
        </Box>
      </Link>
      {user?.userId && (
        <>
          <Stack
            gap={2}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <CustomToggleSwitch
              checked={!isUSD}
              onChange={toggleCurrency}
              label={isUSD ? "USD" : "INR"}
              offStateColor={colors.white}
              onStateColor={colors.safforn}
            />
            {isTablet ? (
              <>
                <Tooltip title="Add Grant">
                  <IconButton
                    onClick={() => {
                      setOnCreated(() => () => refetch());
                      openGrantDialog();
                    }}
                    sx={{
                      p: 1,
                      bgcolor: colors.goldenYellow,
                      color: colors.charcoalNavy,
                      borderRadius: "50%",
                      "&:hover": {
                        bgcolor: colors.goldenYellow,
                        opacity: 0.8,
                      },
                    }}
                  >
                    <AddOutlined />
                  </IconButton>
                </Tooltip>

                <ClickAwayListener onClickAway={handleClickAway}>
                  <Box>
                    <IconButton
                      onClick={(e) => {
                        if (anchorEl) {
                          handleClose();
                        } else {
                          setAnchorEl(e.currentTarget);
                        }
                      }}
                      sx={{ color: colors.white }}
                    >
                      <RiMenu3Line />
                    </IconButton>

                    <ProfileTab
                      open={open}
                      anchorEl={anchorEl}
                      popperRef={popperRef}
                      handleClose={handleClose}
                    />
                  </Box>
                </ClickAwayListener>
              </>
            ) : (
              <>
                <Button
                  buttonText="Add Grant"
                  onClick={() => {
                    setOnCreated(() => () => refetch());
                    openGrantDialog();
                  }}
                  startIcon={<AddOutlined />}
                />
                <ClickAwayListener onClickAway={handleClickAway}>
                  <div>
                    <Avatar
                      sx={{
                        width: "40px",
                        height: "40px",
                        fontSize: "16px",
                        fontWeight: 500,
                        backgroundColor: colors.mediumSlateIndigo,
                        color: colors.white,
                        cursor: "pointer",
                      }}
                      onClick={handleAvatarClick}
                    >
                      {getInitials(user.username)}
                    </Avatar>
                    <ProfileTab
                      open={open}
                      anchorEl={anchorEl}
                      popperRef={popperRef}
                      handleClose={handleClose}
                    />
                  </div>
                </ClickAwayListener>
              </>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Header;
