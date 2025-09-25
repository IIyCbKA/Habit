import React from "react";
import styles from "./styles.module.css";
import sharedStyles from "@/shared/styles.module.css";
import { DefaultAvatar } from "@/assets/icons";
import { useAppSelector } from "@/store/hooks";
import { selectEmail, selectUsername } from "@/features/Auth/slice";
import classNames from "classnames";

export default function Header(): React.ReactElement {
  const username = useAppSelector(selectUsername);
  const email = useAppSelector(selectEmail);

  const usernameStyles = classNames(styles.username, sharedStyles.truncateText);
  const emailStyles = classNames(styles.email, sharedStyles.truncateText);

  return (
    <div className={styles.headerRoot}>
      <DefaultAvatar className={styles.avatar} />
      <div className={styles.description}>
        <span className={usernameStyles}>{username}</span>
        <span className={emailStyles}>{email}</span>
      </div>
    </div>
  );
}
