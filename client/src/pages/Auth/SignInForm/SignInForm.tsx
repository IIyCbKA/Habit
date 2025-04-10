import React from "react";
import style from "./SignInForm.module.css";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import InputLine from "@/components/InputLine/InputLine";
import {
  FIRST_LINE_PLACEHOLDER,
  SECOND_LINE_PLACEHOLDER,
  EMPTY_STRING,
  SIGN_IN_BTN_TEXT,
} from "./SignInForm.constants";
import Button from "@/components/Button/Button";

export default function SignInForm(): React.ReactElement {
  const [login, setLogin] = React.useState(EMPTY_STRING);
  const [password, setPassword] = React.useState(EMPTY_STRING);

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
        <Button>{SIGN_IN_BTN_TEXT}</Button>
      </div>
    </div>
  );
}
