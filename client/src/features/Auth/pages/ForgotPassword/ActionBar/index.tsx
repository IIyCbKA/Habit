import React from "react";
import styles from "./styles.module.css";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import { TO_SIGN_IN_BUTTON_TEXT, HAVE_AN_ACCOUNT_QUESTION } from "./constants";
import classNames from "classnames";
import { LinkTo } from "@/components";
import { PATHS } from "@/routes/paths";

export default function ActionBar(): React.ReactElement {
  const containerStyles = classNames(
    sharedAuthStyles.actionBarContainer,
    styles.container,
  );

  return (
    <div className={containerStyles}>
      <span className={sharedAuthStyles.actionBarQuestionWrap}>
        {HAVE_AN_ACCOUNT_QUESTION}
      </span>
      <LinkTo to={PATHS.SIGN_IN}>{TO_SIGN_IN_BUTTON_TEXT}</LinkTo>
    </div>
  );
}
