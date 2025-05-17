import React from "react";
import { FormControlLabel, Switch, SxProps } from "@mui/material";
import { colors } from "../constants";

interface CustomToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  labelPosition?: "start" | "end";
  offStateColor?: string;
  onStateColor?: string;
  switchSx?: SxProps;
  labelSx?: SxProps;
}

const CustomToggleSwitch: React.FC<CustomToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  labelPosition = "start",
  offStateColor = colors.white,
  onStateColor = colors.green,
  switchSx,
  labelSx,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={onChange}
          sx={{
            // Thumb when unchecked
            "& .MuiSwitch-thumb": {
              backgroundColor: offStateColor,
            },
            // Thumb when checked
            "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
              backgroundColor: onStateColor,
            },
            // Track background
            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
              backgroundColor: offStateColor,
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: onStateColor,
            },
            ...switchSx,
          }}
        />
      }
      label={label}
      labelPlacement={labelPosition}
      sx={{
        color: "white",
        ".MuiFormControlLabel-label": {
          fontWeight: 500,
        },
        ...labelSx,
      }}
    />
  );
};

export default CustomToggleSwitch;
