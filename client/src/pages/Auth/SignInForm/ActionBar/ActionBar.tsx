import React from "react";
import styles from "./ActionBar.module.css";
import LinkTo from "@/components/Link/LinkTo";
import { FORGOT_PASSWORD_TEXT, SIGN_UP_TEXT } from "./ActionBar.constants";
import { PUBLIC_PATHS } from "@/routes/PublicRoutes.constants";
import Button from "@/components/Button/Button";
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
