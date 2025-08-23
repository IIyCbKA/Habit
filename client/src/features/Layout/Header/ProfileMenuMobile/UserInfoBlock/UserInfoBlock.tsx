import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/features/Auth/auth.slice";
import styles from "./userInfoBlock.module.css";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";

export default function UserInfoBlock(): React.ReactElement {
  const username = useAppSelector(selectUser)?.username;

  return (
    <div className={styles.blockContainer}>
      <DefaultAvatar className={styles.profileIcon} />
      <div className={styles.usernameWrap}>{username}</div>
    </div>
  );
}
