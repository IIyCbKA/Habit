import React from "react";
import styles from "./actionBar.module.css";
import {
  HAVE_AN_ACCOUNT_QUESTION,
  TO_SIGN_IN_BUTTON_TEXT,
} from "./actionBar.constants";
import Button from "@/components/Buttons/Button/Button";
import { useAppDispatch } from "@/store/hooks";
import { setAuthForm } from "@/features/uiState/uiState.slice";

export default function ActionBar(): React.ReactElement {
  const dispatch = useAppDispatch();

  const onClickSignIn: () => void = (): void => {
    dispatch(setAuthForm("signIn"));
  };

  return (
    <div className={styles.actionBarContainer}>
      <span className={styles.questionWrap}>{HAVE_AN_ACCOUNT_QUESTION}</span>
      <Button onClick={onClickSignIn}>{TO_SIGN_IN_BUTTON_TEXT}</Button>
    </div>
  );
}
