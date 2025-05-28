import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/features/Auth/auth.slice";
import styles from "./userInfoBlock.module.css";
import sharedStyles from "@/shared/shared.module.css";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";
import classNames from "classnames";

export default function UserInfoBlock(): React.ReactElement {
  const username = useAppSelector(selectUser)?.username;
  const usernameStyles = classNames(
    styles.usernameWrap,
    sharedStyles.upperText,
  );

  return (
    <div className={styles.blockContainer}>
      <DefaultAvatar className={styles.profileIcon} />
      <div className={usernameStyles}>{username}</div>
    </div>
  );
}
