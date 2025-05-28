import React from "react";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";
import styles from "./userInfoBlock.module.css";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/features/Auth/auth.slice";
import classNames from "classnames";
import sharedStyles from "@/shared/shared.module.css";

export default function UserInfoBlock(): React.ReactElement {
  const username = useAppSelector(selectUser)?.username;

  const usernameStyles = classNames(
    sharedStyles.upperText,
    styles.profileUsername,
  );

  return (
    <div className={styles.profileInfoContainer}>
      <DefaultAvatar className={styles.profileIcon} />
      <div className={usernameStyles}>{username}</div>
    </div>
  );
}
