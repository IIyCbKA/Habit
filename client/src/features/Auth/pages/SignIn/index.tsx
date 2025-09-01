import React from "react";
import { useNavigate } from "react-router-dom";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import {
  LOGIN_PLACEHOLDER,
  PASSWORD_PLACEHOLDER,
  SIGN_IN_BTN_TEXT,
  TITLE_SCREEN,
} from "./constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "@/shared/constants";
import ActionBar from "./ActionBar";
import SignInWith from "@/features/Auth/shared/SignInWith";
import { loginUser } from "@/features/Auth/slice";
import { useAppDispatch } from "@/store/hooks";
import { Input, Button, Divider, Typography } from "@/components";
import { PATHS } from "@/routes/paths";
import PasswordAdornment from "@/features/Auth/shared/PasswordAdornment";

export default function SignIn(): React.ReactElement {
  const dispatch = useAppDispatch();
  const [identifier, setIdentifier] = React.useState<string>(EMPTY_STRING);
  const [password, setPassword] = React.useState<string>(EMPTY_STRING);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isProcessing, setProcessing] = React.useState<boolean>(false);
  const signInButtonDisabled: boolean =
    identifier.length === EMPTY_STRING_LENGTH ||
    password.length === EMPTY_STRING_LENGTH ||
    isProcessing;
  const navigate = useNavigate();

  const onLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setIdentifier(e.target.value);
  };

  const onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setPassword(e.target.value);
  };

  const onPasswordVisibleClick: () => void = (): void => {
    setShowPassword((prev: boolean): boolean => !prev);
  };

  const onSubmit: (e: React.FormEvent) => void = async (
    e: React.FormEvent,
  ): Promise<void> => {
    setProcessing(true);

    e.preventDefault();
    try {
      const data = await dispatch(loginUser({ identifier, password })).unwrap();
      if (data.user && !data.user.isEmailVerified) {
        navigate(PATHS.EMAIL_CONFIRM);
      }
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
          name={"identifier"}
          autoComplete={"username"}
          value={identifier}
          onChange={onLoginChange}
          placeholder={LOGIN_PLACEHOLDER}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          type={showPassword ? "text" : "password"}
          name={"password"}
          autoComplete={"current-password"}
          value={password}
          onChange={onPasswordChange}
          placeholder={PASSWORD_PLACEHOLDER}
          inputAdornment={
            <PasswordAdornment
              isShow={showPassword}
              onClick={onPasswordVisibleClick}
            />
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          isLoading={isProcessing}
          fullWidth
          disabled={signInButtonDisabled}
          variant={"contained"}
          type={"submit"}
        >
          {SIGN_IN_BTN_TEXT}
        </Button>
        <SignInWith />
        <ActionBar />
      </div>
    </form>
  );
}
