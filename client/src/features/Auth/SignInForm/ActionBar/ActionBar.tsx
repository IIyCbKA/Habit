import React from "react";
import styles from "./actionBar.module.css";
import LinkTo from "@/components/Link/LinkTo";
import { FORGOT_PASSWORD_TEXT, SIGN_UP_TEXT } from "./actionBar.constants";
import { PUBLIC_PATHS } from "@/routes/publicRoutes.constants";
import Button from "@/components/Buttons/Button/Button";
import { useAppDispatch } from "@/store/hooks";
import { setAuthForm } from "@/features/uiState/uiState.slice";

export default function ActionBar(): React.ReactElement {
  const dispatch = useAppDispatch();

  const onClickSignUp: () => void = (): void => {
    dispatch(setAuthForm("signUp"));
  };

  return (
    <div className={styles.actionBarContainer}>
      <LinkTo to={PUBLIC_PATHS.RESET_PASSWORD}>{FORGOT_PASSWORD_TEXT}</LinkTo>
      <Button onClick={onClickSignUp}>{SIGN_UP_TEXT}</Button>
    </div>
  );
}
