import React from "react";
import styles from "./actionBar.module.css";
import sharedStyles from "../../shared/shared.module.css";
import Button from "@/components/Buttons/Button/Button";
import {
  TO_SIGN_IN_BTN_TEXT,
  HAVE_AN_ACCOUNT_QUESTION,
} from "./actionBar.constants";
import { useAppDispatch } from "@/store/hooks";
import { setAuthScreen } from "@/features/uiState/uiState.slice";
import classNames from "classnames";

export default function ActionBar(): React.ReactElement {
  const dispatch = useAppDispatch();

  const containerStyles = classNames(
    sharedStyles.actionBarContainer,
    styles.container,
  );

  const onClick: () => void = (): void => {
    dispatch(setAuthScreen("signIn"));
  };

  return (
    <div className={containerStyles}>
      <span className={sharedStyles.actionBarQuestionWrap}>
        {HAVE_AN_ACCOUNT_QUESTION}
      </span>
      <Button variant={"text"} type={"button"} onClick={onClick}>
        {TO_SIGN_IN_BTN_TEXT}
      </Button>
    </div>
  );
}
