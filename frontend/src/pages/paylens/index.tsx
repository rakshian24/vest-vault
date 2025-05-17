import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import CustomSegmentedToggle, {
  CustomSegmentedToggleOption,
} from "../../components/CustomSegmentedToggle";
import { colors, MAX_FIXED_PAY, MAX_HIKE_PERCENTAGE } from "../../constants";
import CustomToggleSwitch from "../../components/CustomToggleSwitch";
import CustomInput from "../../components/CustomInput";
import { CurrencyRupee, PercentOutlined } from "@mui/icons-material";
import EarningsDeductionTable from "./components/EarningsDeductionTable";
import { useSalaryComponents } from "../../hooks/useSalaryComponents";
import { ReactComponent as MoneySvg } from "../../assets/svgs/money.svg";

type Period = "Monthly" | "Annually";

const PayLensPage = () => {
  const [period, setPeriod] = useState<Period>("Monthly");
  const [enteredFixedPay, setEnteredFixedPay] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [enteredHikePercentage, setEnteredHikePercentage] =
    useState<string>("");
  const [hasHikeError, setHasHikeError] = useState<boolean>(false);

  const [isHikeCalculatorSelected, setIsHikeCalculatorSelected] =
    useState<boolean>(false);

  const fixedPayWithHike =
    Number(enteredFixedPay) * (Number(enteredHikePercentage) / 100) +
    Number(enteredFixedPay);

  const isPeriodMonthly = period === "Monthly";
  const salaryBreakdown = useSalaryComponents(Number(enteredFixedPay));
  const salaryBreakdownForHike = useSalaryComponents(fixedPayWithHike);

  const showWithHikeComparison =
    !!enteredHikePercentage &&
    isHikeCalculatorSelected &&
    !!salaryBreakdownForHike;

  const toggleOptions: CustomSegmentedToggleOption<"Monthly" | "Annually">[] = [
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ];

  const handleFixedPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (Number(value) <= MAX_FIXED_PAY) {
      setEnteredFixedPay(value);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const handleHikePercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (Number(value) <= MAX_HIKE_PERCENTAGE) {
      setEnteredHikePercentage(value);
      setHasHikeError(false);
    } else {
      setHasHikeError(true);
    }
  };

  return (
    <Stack gap={2} mb={5}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        padding={3}
      >
        <MoneySvg width={"250px"} />
      </Box>
      <Box textAlign={"center"}>
        <CustomToggleSwitch
          checked={isHikeCalculatorSelected}
          onChange={() =>
            setIsHikeCalculatorSelected(!isHikeCalculatorSelected)
          }
          label="Compare with hiked salary"
          labelSx={{ color: colors.black }}
          onStateColor={colors.mediumSlateIndigo}
          offStateColor={colors.lightGrey1}
        />
      </Box>

      <CustomSegmentedToggle
        options={toggleOptions}
        selected={period}
        onChange={(newValue: Period) => {
          if (newValue !== period) {
            setPeriod(newValue);
          }
        }}
        sx={{ flex: 1 }}
        thumbColor={colors.mediumSlateIndigo}
        bgColor={colors.charcoalNavy}
      />

      <CustomInput
        autoComplete=""
        type="number"
        inputMode="numeric" // Ensures the numeric keypad opens on iOS
        value={enteredFixedPay}
        inputProps={{ min: 0, max: 100000000, step: 1 }}
        styles={{ width: "100%" }}
        inputStyles={{
          borderRadius: "1rem",
          ...(hasError && { color: colors.red }),
        }}
        error={hasError}
        label={
          hasError ? `Fixed pay cannot exceed ${MAX_FIXED_PAY}` : "Fixed pay"
        }
        placeholder="Enter your yearly fixed pay"
        startIcon={
          <CurrencyRupee sx={{ ...(hasError && { color: colors.red }) }} />
        }
        onChange={handleFixedPayChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur(); // Close the keyboard
          }
        }}
      />

      {isHikeCalculatorSelected && (
        <CustomInput
          autoComplete=""
          type="number"
          inputMode="numeric" // Ensures the numeric keypad opens on iOS
          value={enteredHikePercentage}
          inputProps={{ min: 0, max: 200, step: 1 }}
          styles={{ width: "100%" }}
          inputStyles={{
            borderRadius: "1rem",
            ...(hasHikeError && { color: colors.red }),
          }}
          error={hasHikeError}
          label={
            hasHikeError
              ? `Hike percentage cannot exceed ${MAX_HIKE_PERCENTAGE}.`
              : "Hike percentage"
          }
          placeholder="Enter your hike percentage"
          endIcon={
            <PercentOutlined
              sx={{ ...(hasHikeError && { color: colors.red }) }}
            />
          }
          onChange={handleHikePercentageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      )}
      {salaryBreakdown && (
        <EarningsDeductionTable
          showWithHikeComparison={showWithHikeComparison}
          isPeriodMonthly={isPeriodMonthly}
          salaryBreakdown={salaryBreakdown}
          salaryBreakdownForHike={salaryBreakdownForHike}
        />
      )}
    </Stack>
  );
};

export default PayLensPage;
