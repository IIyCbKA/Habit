import React from "react";
import styles from "./user.module.css";
import sharedStyles from "@/shared/shared.module.css";
import IconButton from "@/components/Buttons/IconButton/IconButton";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";
import classNames from "classnames";

export default function User(): React.ReactElement {
  const [menuIsOpen, setMenuIsOpen] = React.useState<boolean>(false);

  const profileWrapStyles = classNames(styles.profileWrap, {
    [sharedStyles.show]: menuIsOpen,
    [sharedStyles.hidden]: !menuIsOpen,
  });

  const onAvatarClick: () => void = (): void => {
    setMenuIsOpen((prev: boolean): boolean => !prev);
  };

  return (
    <div className={styles.userContainer}>
      <IconButton onClick={onAvatarClick}>
        <DefaultAvatar className={styles.iconContainer} />
      </IconButton>
      <div className={profileWrapStyles}>
        <div className={styles.profileContainer}>Random text</div>
      </div>
    </div>
  );
}
