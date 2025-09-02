import React from "react";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import {
  CONFIRM_NEW_PASSWORD_INPUT_PLACEHOLDER,
  NEW_PASSWORD_INPUT_PLACEHOLDER,
  SET_NEW_PASSWORD_BUTTON_TEXT,
  TITLE_SCREEN,
} from "./constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "@/shared/constants";
import { Button, Divider, Input, Typography } from "@/components";
import PasswordAdornment from "@/features/Auth/shared/PasswordAdornment";
import { useAppDispatch } from "@/store/hooks";
import { passwordResetConfirm } from "@/features/Auth/slice";
import { useLoaderData } from "react-router-dom";
import { PasswordResetValidateData } from "@/features/Auth/types";

export default function ResetPassword(): React.ReactElement {
  const { uid, token } = useLoaderData() as PasswordResetValidateData;
  const dispatch = useAppDispatch();

  const [password, setPassword] = React.useState<string>(EMPTY_STRING);
  const [passwordConfirmation, setPasswordConfirmation] =
    React.useState<string>(EMPTY_STRING);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    React.useState<boolean>(false);
  const [isProcessing, setProcessing] = React.useState<boolean>(false);
  const isButtonDisabled =
    password !== passwordConfirmation ||
    password.length === EMPTY_STRING_LENGTH;

  const onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setPassword(e.target.value);
  };

  const onPasswordConfirmationChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPasswordConfirmation(e.target.value);
  };

  const onPasswordVisibilityClick: () => void = (): void => {
    setShowPassword((prev: boolean): boolean => !prev);
  };

  const onPasswordConfirmationVisibilityClick: () => void = (): void => {
    setShowPasswordConfirmation((prev: boolean): boolean => !prev);
  };

  const onSubmit: (e: React.FormEvent) => void = async (
    e: React.FormEvent,
  ): Promise<void> => {
    setProcessing(true);

    e.preventDefault();
    try {
      await dispatch(
        passwordResetConfirm({ uid, token, newPassword: password }),
      );
    } catch (e) {
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className={sharedAuthStyles.formWrap} onSubmit={onSubmit}>
      <div className={sharedAuthStyles.formContainer}>
        <Typography variant={"h1"}>{TITLE_SCREEN}</Typography>
        <Input
          fullWidth
          autoComplete={"new-password"}
          type={showPassword ? "text" : "password"}
          placeholder={NEW_PASSWORD_INPUT_PLACEHOLDER}
          name={"password"}
          value={password}
          onChange={onPasswordChange}
          inputAdornment={
            <PasswordAdornment
              isShow={showPassword}
              onClick={onPasswordVisibilityClick}
            />
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={"new-password"}
          type={showPasswordConfirmation ? "text" : "password"}
          placeholder={CONFIRM_NEW_PASSWORD_INPUT_PLACEHOLDER}
          name={"confirm-password"}
          value={passwordConfirmation}
          onChange={onPasswordConfirmationChange}
          inputAdornment={
            <PasswordAdornment
              isShow={showPasswordConfirmation}
              onClick={onPasswordConfirmationVisibilityClick}
            />
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          isLoading={isProcessing}
          fullWidth
          disabled={isButtonDisabled}
          variant={"contained"}
          type={"submit"}
        >
          {SET_NEW_PASSWORD_BUTTON_TEXT}
        </Button>
      </div>
    </form>
  );
}
