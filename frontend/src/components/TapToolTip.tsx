import { Box, ClickAwayListener, Popper, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { colors } from "../constants";

const TapTooltip = ({ value, tooltip }: { value: string; tooltip: string }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box display="inline-block">
        <span
          ref={anchorRef}
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          <Typography component="span">{value}</Typography>
        </span>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="top"
          modifiers={[{ name: "offset", options: { offset: [0, 12] } }]}
        >
          <Box
            sx={{
              position: "relative",
              bgcolor: colors.white,
              color: colors.charcoalNavy,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              fontSize: "0.75rem",
              maxWidth: "200px",
              boxShadow: 3,
              "&::before": {
                content: '""',
                position: "absolute",
                bottom: -6,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: `6px solid ${colors.white}`,
              },
            }}
          >
            {tooltip}
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default TapTooltip;
