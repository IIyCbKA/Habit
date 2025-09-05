import React from "react";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import {
  CONFIRM_NEW_PASSWORD_INPUT_PLACEHOLDER,
  NEW_PASSWORD_INPUT_PLACEHOLDER,
  SET_NEW_PASSWORD_BUTTON_TEXT,
  TITLE_SCREEN,
} from "./constants";
import { EMPTY_STRING } from "@/shared/constants";
import { Button, Divider, Input, Typography } from "@/components";
import PasswordAdornment from "@/features/Auth/shared/PasswordAdornment";
import { useAppDispatch } from "@/store/hooks";
import { passwordResetConfirm } from "@/features/Auth/slice";
import { useLoaderData } from "react-router-dom";
import { PasswordResetValidateData } from "@/features/Auth/types";
import { ErrorsMap } from "./types";
import {
  validatePassword,
  validatePasswordConfirmation,
} from "@/features/Auth/validators";

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
  const [errors, setErrors] = React.useState<ErrorsMap>({});
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const passwordConfirmationRef = React.useRef<HTMLInputElement | null>(null);

  const onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setPassword(e.target.value);
    if (errors.password)
      setErrors((prev: ErrorsMap) => ({ ...prev, password: undefined }));
  };

  const onPasswordConfirmationChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPasswordConfirmation(e.target.value);
    if (errors.passwordConfirmation)
      setErrors((prev: ErrorsMap) => ({
        ...prev,
        passwordConfirmation: undefined,
      }));
  };

  const onPasswordVisibilityClick: () => void = (): void => {
    setShowPassword((prev: boolean): boolean => !prev);
  };

  const onPasswordConfirmationVisibilityClick: () => void = (): void => {
    setShowPasswordConfirmation((prev: boolean): boolean => !prev);
  };

  const focusFirstError: (errs: ErrorsMap) => void = (
    errs: ErrorsMap,
  ): void => {
    if (errs.password) passwordRef.current?.focus();
    else if (errs.passwordConfirmation)
      passwordConfirmationRef.current?.focus();
  };

  const onSubmit: (e: React.FormEvent) => void = async (
    e: React.FormEvent,
  ): Promise<void> => {
    e.preventDefault();

    const newErrors: ErrorsMap = {
      password: validatePassword(password),
      passwordConfirmation: validatePasswordConfirmation(
        password,
        passwordConfirmation,
      ),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      focusFirstError(newErrors);
      return;
    }

    setProcessing(true);
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
    <form className={sharedAuthStyles.formWrap} onSubmit={onSubmit} noValidate>
      <div className={sharedAuthStyles.formContainer}>
        <Typography variant={"h1"}>{TITLE_SCREEN}</Typography>
        <Input
          fullWidth
          ref={passwordRef}
          autoComplete={"new-password"}
          type={showPassword ? "text" : "password"}
          placeholder={NEW_PASSWORD_INPUT_PLACEHOLDER}
          name={"password"}
          value={password}
          onChange={onPasswordChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
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
          ref={passwordConfirmationRef}
          autoComplete={"new-password"}
          type={showPasswordConfirmation ? "text" : "password"}
          placeholder={CONFIRM_NEW_PASSWORD_INPUT_PLACEHOLDER}
          name={"passwordConfirmation"}
          value={passwordConfirmation}
          onChange={onPasswordConfirmationChange}
          error={Boolean(errors.passwordConfirmation)}
          helperText={errors.passwordConfirmation}
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
          variant={"contained"}
          type={"submit"}
        >
          {SET_NEW_PASSWORD_BUTTON_TEXT}
        </Button>
      </div>
    </form>
  );
}
