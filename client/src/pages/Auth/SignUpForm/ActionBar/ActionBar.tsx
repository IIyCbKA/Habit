import React from "react";
import styles from "./ActionBar.module.css";
import sharedStyles from "@/shared/shared.module.css";
import {
  HAVE_AN_ACCOUNT_QUESTION,
  TO_SIGN_IN_BUTTON_TEXT,
} from "./ActionBar.constants";
import classNames from "classnames";
import Button from "@/components/Buttons/DefaultButton/Button";
import { ActionBarProps } from "../../shared/shared.interfaces";

export default function ActionBar({
  toggleFormType,
}: ActionBarProps): React.ReactElement {
  const containerStyles = classNames(
    styles.actionBarContainer,
    sharedStyles.defaultText,
  );

  return (
    <div className={containerStyles}>
      <span className={styles.questionWrap}>{HAVE_AN_ACCOUNT_QUESTION}</span>
      <Button onClick={toggleFormType}>{TO_SIGN_IN_BUTTON_TEXT}</Button>
    </div>
  );
}
