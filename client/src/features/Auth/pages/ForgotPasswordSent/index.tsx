import React from "react";
import styles from "./styles.module.css";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import {
  HAVE_AN_ACCOUNT_QUESTION,
  ROOT_TEXT,
  TITLE_SCREEN,
  TO_SIGN_IN_BUTTON_TEXT,
} from "./constants";
import classNames from "classnames";
import { PATHS } from "@/routes/paths";
import { LinkTo, Typography } from "@/components";

export default function ForgotPasswordSent(): React.ReactElement {
  const questionContainerStyles = classNames(
    sharedAuthStyles.actionBarContainer,
    styles.questionContainer,
  );

  return (
    <div className={sharedAuthStyles.formWrap}>
      <div className={sharedAuthStyles.formContainer}>
        <Typography>{TITLE_SCREEN}</Typography>
        <span className={styles.rootText}>{ROOT_TEXT}</span>
        <div className={questionContainerStyles}>
          <span className={sharedAuthStyles.actionBarQuestionWrap}>
            {HAVE_AN_ACCOUNT_QUESTION}
          </span>
          <LinkTo to={PATHS.SIGN_IN}>{TO_SIGN_IN_BUTTON_TEXT}</LinkTo>
        </div>
      </div>
    </div>
  );
}
