import React from "react";
import styles from "./styles.module.css";
import {
  CHANGE_BUTTON_TEXT,
  TITLE_SCREEN,
  USERNAME_ROW_TITLE,
} from "./constants";
import ControlRow from "@/features/Account/components/ControlRow";
import { User } from "@/assets/icons";
import { useAppSelector } from "@/store/hooks";
import { selectUsername } from "@/features/Auth/slice";

export default function RootAccount(): React.ReactElement {
  const username = useAppSelector(selectUsername);

  return (
    <>
      <span className={styles.title}>{TITLE_SCREEN}</span>
      <ControlRow
        title={USERNAME_ROW_TITLE}
        info={username}
        iconProps={{ children: <User /> }}
        buttonProps={{ children: CHANGE_BUTTON_TEXT }}
      />
    </>
  );
}
