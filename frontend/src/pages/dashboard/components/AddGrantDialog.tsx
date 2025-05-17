import { AddOutlined, CloseOutlined } from "@mui/icons-material";
import { screenSize } from "../../../constants";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  ICreateGrantFormValueTypes,
  InitCreateGrantFormValues,
} from "./helper";
import { CREATE_RSU, UPDATE_RSU } from "../../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../../context/SnackbarContext";
import ErrorBox from "../../../components/ErrorBox";
import Button from "../../../components/CustomButton";
import CustomDatePicker from "../../../components/CustomDatePicker";
import dayjs from "dayjs";
import { CustomInputField } from "../../../components/CustomInputField";
import { FaDollarSign } from "react-icons/fa6";
import { IRsuData } from "../../../components/VestingSchedule/types";

type Props = {
  handleClose: () => void;
  open: boolean;
  onGrantCreated: () => void;
  grantToEdit?: IRsuData;
};

const AddGrantDialog = ({
  open,
  handleClose,
  onGrantCreated,
  grantToEdit,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showSuccess, showError } = useSnackbar();

  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { control, formState, handleSubmit, reset } = useForm({
    defaultValues: { ...InitCreateGrantFormValues },
    mode: "onChange",
  });

  const [createRsu, { loading: isCreateGrantLoading }] =
    useMutation(CREATE_RSU);
  const [updateRsu, { loading: isUpdateGrantLoading }] =
    useMutation(UPDATE_RSU);

  useEffect(() => {
    if (open) {
      if (grantToEdit) {
        reset({
          grantAmount: grantToEdit.grantAmount,
          stockPrice: grantToEdit.stockPrice,
          grantDate: dayjs(grantToEdit.grantDate).toString(),
        });
      } else {
        reset({ ...InitCreateGrantFormValues });
      }
    }
  }, [grantToEdit, open, reset]);

  const { errors } = formState;
  const COMMON_PROPS = { control: control, errors: errors };
  const isFormDisabled =
    !formState.isValid ||
    Number(control._formValues.grantAmount) <= 0 ||
    Number(control._formValues.stockPrice) <= 0;

  const onSubmitHandler = async (formValues: ICreateGrantFormValueTypes) => {
    setIsLoading(true);

    try {
      if (grantToEdit) {
        await updateRsu({
          variables: {
            rsuInput: {
              ...formValues,
              id: grantToEdit._id,
              grantDate: dayjs(formValues.grantDate).format("YYYY-MM-DD"),
              stockPrice: formValues.stockPrice.toString(),
            },
          },
        });

        showSuccess("Grant updated successfully!");
      } else {
        await createRsu({
          variables: {
            rsuInput: {
              ...formValues,
              grantDate: dayjs(formValues.grantDate).format("YYYY-MM-DD"),
            },
          },
        });

        showSuccess("Grant created successfully!");
      }

      onGrantCreated();

      handleClose();
      reset({
        ...InitCreateGrantFormValues,
      });
    } catch (error) {
      console.error("Error while creating todo: ", error);

      showError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        fullScreen={isTablet}
        fullWidth
        maxWidth={"sm"}
        PaperProps={{
          style: {
            borderRadius: !isTablet ? "32px" : "0",
          },
        }}
        open={open}
        onClose={() => {
          reset({ ...InitCreateGrantFormValues });
        }}
      >
        <Stack
          component={"form"}
          noValidate
          onSubmit={handleSubmit(onSubmitHandler)}
          gap={isTablet ? 2 : 0}
        >
          <DialogContent
            dividers
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 5,
              pb: 1,
              ...(isTablet && { px: 2, pt: 3 }),
              gap: 4,
              borderBottom: "none",
            }}
          >
            <DialogTitle sx={{ p: 0 }}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography fontSize={isTablet ? 24 : 28} fontWeight={700}>
                  {grantToEdit ? "Edit Grant" : "Add New Grant"}
                </Typography>
                <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
                  <CloseOutlined />
                </IconButton>
              </Stack>
            </DialogTitle>
            <Stack gap={2}>
              <Controller
                name="grantDate"
                rules={{ required: "Grant date is required" }}
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <CustomDatePicker
                    value={value ? dayjs(value) : null}
                    error={!!error}
                    styles={{ width: "100%" }}
                    onChange={(newValue) => onChange(newValue)}
                    placeholder={"Enter grant date"}
                    label={"Grant date"}
                    disabled={isLoading}
                    dataTestId="grantDatePicker"
                  />
                )}
              />
              <Controller
                name="grantAmount"
                {...COMMON_PROPS}
                rules={{
                  required: "Grant amount is required",
                  min: {
                    value: 1,
                    message: "Grant amount must be greater than 0",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <CustomInputField
                    {...field}
                    type="number"
                    onChange={(e) => {
                      let inputValue = e.target.value.replace(/^0+(?!\.)/, "");

                      // Handle edge cases: empty string, dot-only input, and leading dot
                      if (!inputValue || inputValue === ".") {
                        inputValue = "0";
                      } else if (inputValue.startsWith(".")) {
                        inputValue = `0${inputValue}`;
                      }
                      field.onChange(inputValue);
                    }}
                    sx={{ width: "100%" }}
                    placeholder={"Enter grant amount"}
                    label={"Grant amount"}
                    error={error !== undefined}
                    startIcon={<FaDollarSign />}
                  />
                )}
              />
              <Controller
                name="stockPrice"
                {...COMMON_PROPS}
                rules={{
                  required: "Stock price is required",
                  min: {
                    value: 1,
                    message: "Stock price must be greater than 0",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <CustomInputField
                    {...field}
                    type="number"
                    onChange={(e) => {
                      let inputValue = e.target.value.replace(/^0+(?!\.)/, "");

                      // Handle edge cases: empty string, dot-only input, and leading dot
                      if (!inputValue || inputValue === ".") {
                        inputValue = "0";
                      } else if (inputValue.startsWith(".")) {
                        inputValue = `0${inputValue}`;
                      }
                      field.onChange(inputValue);
                    }}
                    sx={{ width: "100%" }}
                    placeholder={"Enter stock price"}
                    label={"Stock price"}
                    error={error !== undefined}
                    startIcon={<FaDollarSign />}
                  />
                )}
              />

              <ErrorBox formState={formState} style={{ mb: 2 }} />
            </Stack>
          </DialogContent>
          <Box
            sx={{
              py: isTablet ? 0 : 2,
              px: isTablet ? 2 : 5,
              pb: 5,
            }}
          >
            <Button
              startIcon={grantToEdit ? <></> : <AddOutlined />}
              buttonText={grantToEdit ? "Update Grant" : "Add Grant"}
              isLoading={
                isLoading || isCreateGrantLoading || isUpdateGrantLoading
              }
              disabled={isFormDisabled}
              onClick={() => onSubmitHandler}
            />
          </Box>
        </Stack>
      </Dialog>
    </>
  );
};

export default AddGrantDialog;
