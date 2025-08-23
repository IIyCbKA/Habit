import React from "react";
import Button from "@/components/Buttons/Button/Button";
import styles from "./forgotPasswordSent.module.css";
import sharedStyles from "../shared/shared.module.css";
import {
  ROOT_TEXT,
  TITLE_SCREEN,
  TO_SIGN_IN_BTN_TEXT,
} from "./forgotPasswordSent.constants";
import { useAppDispatch } from "@/store/hooks";
import { setAuthScreen } from "@/features/uiState/uiState.slice";
import Typography from "@/components/Typography/Typography";

export default function ForgotPasswordSent(): React.ReactElement {
  const dispatch = useAppDispatch();

  const onClick: () => void = (): void => {
    dispatch(setAuthScreen("signIn"));
  };

  return (
    <div className={sharedStyles.formWrap}>
      <div className={sharedStyles.formContainer}>
        <Typography>{TITLE_SCREEN}</Typography>
        <span className={styles.rootText}>{ROOT_TEXT}</span>
        <Button variant={"contained"} type={"button"} onClick={onClick}>
          {TO_SIGN_IN_BTN_TEXT}
        </Button>
      </div>
    </div>
  );
}
