import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import TextField from "@/components/TextField/TextField";
import {
  LOGIN_PLACEHOLDER,
  PASSWORD_PLACEHOLDER,
  SIGN_IN_BTN_TEXT,
} from "./SignInForm.constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "../shared/shared.constants";
import Button from "@/components/Button/Button";
import { ButtonType } from "@/components/Button/Button.enums";
import ActionBar from "./ActionBar/ActionBar";
import SignInWith from "../shared/SignInWith/SignInWith";
import Divider from "@/components/Divider/Divider";
import { FormProps } from "../shared/shared.interfaces";
import {
  AutoCompleteMode,
  TextFieldType,
} from "@/components/TextField/TextField.enums";

export default function SignInForm({
  toggleFormType,
}: FormProps): React.ReactElement {
  const [login, setLogin] = React.useState<string>(EMPTY_STRING);
  const [password, setPassword] = React.useState<string>(EMPTY_STRING);
  const signInButtonDisabled: boolean =
    login.length === EMPTY_STRING_LENGTH ||
    password.length === EMPTY_STRING_LENGTH;

  const handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setLogin(e.target.value);
  };

  const handlePasswordChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleSignInClick: () => void = (): void => {};

  return (
    <form className={sharedAuthStyles.formWrap}>
      <div className={sharedAuthStyles.formContainer}>
        <Logotype className={sharedAuthStyles.formLogotype} />
        <TextField
          fullWidth
          value={login}
          onChange={handleLoginChange}
          placeholder={LOGIN_PLACEHOLDER}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <TextField
          fullWidth
          type={TextFieldType.Password}
          autoComplete={AutoCompleteMode.CurrentPassword}
          value={password}
          onChange={handlePasswordChange}
          placeholder={PASSWORD_PLACEHOLDER}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          fullWidth
          disabled={signInButtonDisabled}
          variant={ButtonType.Contained}
          onClick={handleSignInClick}
        >
          {SIGN_IN_BTN_TEXT}
        </Button>
        <ActionBar toggleFormType={toggleFormType} />
        <SignInWith />
      </div>
    </form>
  );
}
