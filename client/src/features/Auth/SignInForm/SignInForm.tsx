import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import Input from "@/components/Input/Input";
import {
  LOGIN_ERROR_TEXT,
  LOGIN_PLACEHOLDER,
  PASSWORD_PLACEHOLDER,
  SIGN_IN_BTN_TEXT,
} from "./signInForm.constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "@/shared/shared.constants";
import Button from "@/components/Buttons/Button/Button";
import ActionBar from "./ActionBar/ActionBar";
import SignInWith from "../shared/SignInWith/SignInWith";
import Divider from "@/components/Divider/Divider";
import { FormProps } from "../shared/shared.interfaces";
import IconButton from "@/components/Buttons/IconButton/IconButton";
import OpenEye from "@/assets/icons/open_eye_24x24.svg?react";
import CloseEye from "@/assets/icons/close_eye_24x24.svg?react";
import { loginUser, selectAuthStatus } from "../auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Message from "@/components/Message/Message";

export default function SignInForm({
  toggleFormType,
}: FormProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const [identifier, setIdentifier] = React.useState<string>(EMPTY_STRING);
  const [password, setPassword] = React.useState<string>(EMPTY_STRING);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showLoginError, setShowLoginError] = React.useState<boolean>(false);
  const signInButtonDisabled: boolean =
    identifier.length === EMPTY_STRING_LENGTH ||
    password.length === EMPTY_STRING_LENGTH;

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

  const onSubmit: (e: React.FormEvent) => void = (e: React.FormEvent): void => {
    e.preventDefault();
    dispatch(loginUser({ identifier, password })).finally((): void =>
      setShowLoginError(authStatus === "failed"),
    );
  };

  return (
    <form className={sharedAuthStyles.formWrap} onSubmit={onSubmit}>
      <div className={sharedAuthStyles.formContainer}>
        <Logotype className={sharedAuthStyles.formLogotype} />
        <Input
          fullWidth
          autoComplete={"username"}
          value={identifier}
          onChange={onLoginChange}
          placeholder={LOGIN_PLACEHOLDER}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          type={showPassword ? "text" : "password"}
          autoComplete={"current-password"}
          value={password}
          onChange={onPasswordChange}
          placeholder={PASSWORD_PLACEHOLDER}
          inputAdornment={
            <IconButton onClick={onPasswordVisibleClick}>
              {showPassword ? <CloseEye /> : <OpenEye />}
            </IconButton>
          }
        />
        {showLoginError ? (
          <Message variant={"error"}>{LOGIN_ERROR_TEXT}</Message>
        ) : (
          <Divider className={sharedAuthStyles.formDivider} flexItem />
        )}
        <Button
          fullWidth
          disabled={signInButtonDisabled}
          variant={"contained"}
          type={"submit"}
        >
          {SIGN_IN_BTN_TEXT}
        </Button>
        <ActionBar toggleFormType={toggleFormType} />
        <SignInWith />
      </div>
    </form>
  );
}
