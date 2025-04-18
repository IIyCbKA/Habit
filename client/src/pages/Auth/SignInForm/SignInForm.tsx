import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import InputLine from "@/components/InputLine/InputLine";
import {
  EMPTY_STRING,
  FIRST_LINE_PLACEHOLDER,
  SECOND_LINE_PLACEHOLDER,
  SIGN_IN_BTN_TEXT,
  EMPTY_STRING_LENGTH,
} from "./SignInForm.constants";
import Button from "@/components/Button/Button";
import { ButtonType } from "@/components/Button/Button.enums";
import ActionBar from "./ActionBar/ActionBar";
import SignInWith from "./SignInWith/SignInWith";
import Divider from "@/components/Divider/Divider";
import { FormData } from "../shared/shared.interface";

export default function SignInForm({
  onClickChangeForm,
}: FormData): React.ReactElement {
  const [login, setLogin] = React.useState(EMPTY_STRING);
  const [password, setPassword] = React.useState(EMPTY_STRING);
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
    <div className={sharedAuthStyles.formWrap}>
      <div className={sharedAuthStyles.formContainer}>
        <Logotype className={sharedAuthStyles.formLogotype} />
        <InputLine
          fullWidth
          value={login}
          onChange={handleLoginChange}
          placeholder={FIRST_LINE_PLACEHOLDER}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <InputLine
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          placeholder={SECOND_LINE_PLACEHOLDER}
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
        <ActionBar onClickSignUpButton={onClickChangeForm} />
        <SignInWith />
      </div>
    </div>
  );
}
