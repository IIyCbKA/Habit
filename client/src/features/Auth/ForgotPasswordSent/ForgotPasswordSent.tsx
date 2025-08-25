import React from "react";
import Button from "@/components/Buttons/Button/Button";
import styles from "./forgotPasswordSent.module.css";
import sharedStyles from "../shared/shared.module.css";
import {
  HAVE_AN_ACCOUNT_QUESTION,
  ROOT_TEXT,
  TITLE_SCREEN,
  TO_SIGN_IN_BTN_TEXT,
} from "./forgotPasswordSent.constants";
import { useAppDispatch } from "@/store/hooks";
import { setAuthScreen } from "@/features/uiState/uiState.slice";
import Typography from "@/components/Typography/Typography";
import classNames from "classnames";

export default function ForgotPasswordSent(): React.ReactElement {
  const dispatch = useAppDispatch();

  const questionContainerStyles = classNames(
    sharedStyles.actionBarContainer,
    styles.questionContainer,
  );

  const onClick: () => void = (): void => {
    dispatch(setAuthScreen("signIn"));
  };

  return (
    <div className={sharedStyles.formWrap}>
      <div className={sharedStyles.formContainer}>
        <Typography>{TITLE_SCREEN}</Typography>
        <span className={styles.rootText}>{ROOT_TEXT}</span>
        <div className={questionContainerStyles}>
          <span className={sharedStyles.actionBarQuestionWrap}>
            {HAVE_AN_ACCOUNT_QUESTION}
          </span>
          <Button variant={"plain"} onClick={onClick}>
            {TO_SIGN_IN_BTN_TEXT}
          </Button>
        </div>
      </div>
    </div>
  );
}
