import React from "react";
import styles from "./actionBar.module.css";
import LinkTo from "@/components/Link/LinkTo";
import { FORGOT_PASSWORD_TEXT, SIGN_UP_TEXT } from "./actionBar.constants";
import { PUBLIC_PATHS } from "@/routes/publicRoutes.constants";
import Button from "@/components/Buttons/DefaultButton/Button";
import { ActionBarProps } from "../../shared/shared.interfaces";

export default function ActionBar({
  toggleFormType,
}: ActionBarProps): React.ReactElement {
  return (
    <div className={styles.actionBarContainer}>
      <LinkTo path={PUBLIC_PATHS.RESET_PASSWORD}>{FORGOT_PASSWORD_TEXT}</LinkTo>
      <Button onClick={toggleFormType}>{SIGN_UP_TEXT}</Button>
    </div>
  );
}
