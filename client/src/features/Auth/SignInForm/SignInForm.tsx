import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import Input from "@/components/Input/Input";
import {
  LOGIN_PLACEHOLDER,
  PASSWORD_PLACEHOLDER,
  SIGN_IN_BTN_TEXT,
} from "./signInForm.constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "../shared/shared.constants";
import Button from "@/components/Buttons/DefaultButton/Button";
import { ButtonVariant } from "@/components/Buttons/DefaultButton/button.enums";
import ActionBar from "./ActionBar/ActionBar";
import SignInWith from "../shared/SignInWith/SignInWith";
import Divider from "@/components/Divider/Divider";
import { FormProps } from "../shared/shared.interfaces";
import { AutoCompleteMode, InputType } from "@/components/Input/input.enums";
import IconButton from "@/components/Buttons/IconButton/IconButton";
import OpenEye from "@/assets/icons/open_eye_24x24.svg?react";
import CloseEye from "@/assets/icons/close_eye_24x24.svg?react";
import { ButtonType } from "@/components/Buttons/shared.enums";
import { loginUser } from "../auth.slice";

export default function SignInForm({
  toggleFormType,
}: FormProps): React.ReactElement {
  const [username, setUsername] = React.useState<string>(EMPTY_STRING);
  const [password, setPassword] = React.useState<string>(EMPTY_STRING);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const signInButtonDisabled: boolean =
    username.length === EMPTY_STRING_LENGTH ||
    password.length === EMPTY_STRING_LENGTH;

  const onLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setUsername(e.target.value);
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
    loginUser({username, password});
  };

  return (
    <form className={sharedAuthStyles.formWrap} onSubmit={onSubmit}>
      <div className={sharedAuthStyles.formContainer}>
        <Logotype className={sharedAuthStyles.formLogotype} />
        <Input
          fullWidth
          value={username}
          onChange={onLoginChange}
          placeholder={LOGIN_PLACEHOLDER}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          type={showPassword ? InputType.Text : InputType.Password}
          autoComplete={AutoCompleteMode.CurrentPassword}
          value={password}
          onChange={onPasswordChange}
          placeholder={PASSWORD_PLACEHOLDER}
          inputAdornment={
            <IconButton onClick={onPasswordVisibleClick}>
              {showPassword ? <CloseEye /> : <OpenEye />}
            </IconButton>
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          fullWidth
          disabled={signInButtonDisabled}
          variant={ButtonVariant.Contained}
          type={ButtonType.Submit}
        >
          {SIGN_IN_BTN_TEXT}
        </Button>
        <ActionBar toggleFormType={toggleFormType} />
        <SignInWith />
      </div>
    </form>
  );
}
