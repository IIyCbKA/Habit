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

export default function ResetPassword(): React.ReactElement {
  const [password, setPassword] = React.useState<string>(EMPTY_STRING);
  const [passwordConfirmation, setPasswordConfirmation] =
    React.useState<string>(EMPTY_STRING);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    React.useState<boolean>(false);

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

  const onSubmit = async () => {};

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
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button fullWidth variant={"contained"}>
          {SET_NEW_PASSWORD_BUTTON_TEXT}
        </Button>
      </div>
    </form>
  );
}
