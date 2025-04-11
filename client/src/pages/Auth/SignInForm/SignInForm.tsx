import React from "react";
import style from "./SignInForm.module.css";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import InputLine from "@/components/InputLine/InputLine";
import {
  EMPTY_STRING,
  FIRST_LINE_PLACEHOLDER,
  SECOND_LINE_PLACEHOLDER,
  SIGN_IN_BTN_TEXT,
} from "./SignInForm.constants";
import Button from "@/components/Button/Button";
import { BUTTON_TYPE } from "@/components/Button/Button.constants";

export default function SignInForm(): React.ReactElement {
  const [login, setLogin] = React.useState(EMPTY_STRING);
  const [password, setPassword] = React.useState(EMPTY_STRING);
  const signInButtonDisabled: boolean =
    login.length == 0 || password.length == 0;

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

  const handleSignInClick: (e: React.MouseEvent<HTMLElement>) => void = (
    e: React.MouseEvent<HTMLElement>,
  ): void => {};

  return (
    <div className={style.signInWrap}>
      <div className={style.signInContainer}>
        <Logotype className={style.signInLogotype} />
        <InputLine
          fullWidth
          value={login}
          onChange={handleLoginChange}
          placeholder={FIRST_LINE_PLACEHOLDER}
        />
        <div className={style.divider} />
        <InputLine
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          placeholder={SECOND_LINE_PLACEHOLDER}
        />
        <div className={style.divider} />
        <Button
          fullWidth
          disabled={signInButtonDisabled}
          variant={BUTTON_TYPE.CONTAINED}
          onClick={handleSignInClick}
        >
          {SIGN_IN_BTN_TEXT}
        </Button>
      </div>
    </div>
  );
}
