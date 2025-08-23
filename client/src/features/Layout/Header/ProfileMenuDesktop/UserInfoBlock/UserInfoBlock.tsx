import React from "react";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";
import styles from "./userInfoBlock.module.css";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/features/Auth/auth.slice";

export default function UserInfoBlock(): React.ReactElement {
  const username = useAppSelector(selectUser)?.username;

  return (
    <div className={styles.profileInfoContainer}>
      <DefaultAvatar className={styles.profileIcon} />
      <div className={styles.profileUsername}>{username}</div>
    </div>
  );
}
