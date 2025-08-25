import React from "react";
import styles from "./buttonsBlock.module.css";
import {
  PATTERN_BUTTON_TEXT,
  SETTINGS_BUTTON_TEXT,
  SIGN_OUT_BUTTON_TEXT,
} from "./buttonsBlock.constants";
import Button from "@/components/Buttons/Button/Button";
import { logout } from "@/features/Auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import classNames from "classnames";

export default function ButtonsBlock(): React.ReactElement {
  const dispatch = useAppDispatch();

  const onSignOut: () => void = (): void => {
    dispatch(logout());
  };

  return (
    <>
      <Button fullWidth className={styles.defaultButton}>
        {PATTERN_BUTTON_TEXT}
      </Button>
      <Button fullWidth className={styles.defaultButton}>
        {PATTERN_BUTTON_TEXT}
      </Button>
      <Button fullWidth className={styles.defaultButton}>
        {SETTINGS_BUTTON_TEXT}
      </Button>
      <Button
        fullWidth
        className={classNames(styles.defaultButton, styles.logoutButton)}
        onClick={onSignOut}
      >
        {SIGN_OUT_BUTTON_TEXT}
      </Button>
    </>
  );
}
