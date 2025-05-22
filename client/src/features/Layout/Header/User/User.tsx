import React from "react";
import styles from "./user.module.css";
import IconButton from "@/components/Buttons/IconButton/IconButton";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";
import Dropdown from "@/components/Dropdown/Dropdown";

export default function User(): React.ReactElement {
  const [menuIsOpen, setMenuIsOpen] = React.useState<boolean>(false);

  const onAvatarClick: () => void = (): void => {
    setMenuIsOpen((prev: boolean): boolean => !prev);
  };

  return (
    <div className={styles.userContainer}>
      <IconButton onClick={onAvatarClick}>
        <DefaultAvatar className={styles.iconContainer} />
      </IconButton>
      <Dropdown show={menuIsOpen} />
    </div>
  );
}
