import React from "react";
import styles from "./actionBar.module.css";
import sharedStyles from "../../shared/shared.module.css";
import {
  HAVE_AN_ACCOUNT_QUESTION,
  TO_SIGN_IN_BUTTON_TEXT,
} from "./actionBar.constants";
import Button from "@/components/Buttons/Button/Button";
import { useAppDispatch } from "@/store/hooks";
import { setAuthScreen } from "@/features/uiState/uiState.slice";
import classNames from "classnames";

export default function ActionBar(): React.ReactElement {
  const dispatch = useAppDispatch();

  const containerStyles = classNames(
    sharedStyles.actionBarContainer,
    styles.container,
  );

  const onClickSignIn: () => void = (): void => {
    dispatch(setAuthScreen("signIn"));
  };

  return (
    <div className={containerStyles}>
      <span className={sharedStyles.actionBarQuestionWrap}>
        {HAVE_AN_ACCOUNT_QUESTION}
      </span>
      <Button variant={"plain"} onClick={onClickSignIn}>
        {TO_SIGN_IN_BUTTON_TEXT}
      </Button>
    </div>
  );
}
