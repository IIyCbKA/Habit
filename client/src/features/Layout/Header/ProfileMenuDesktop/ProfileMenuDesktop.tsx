import React from "react";
import styles from "./profileMenuDesktop.module.css";
import IconButton from "@/components/Buttons/IconButton/IconButton";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";
import Dropdown from "@/components/Dropdown/Dropdown";
import ClickAwayListener from "@/components/ClickAwayListener/ClickAwayListener";
import UserInfoBlock from "./UserInfoBlock/UserInfoBlock";
import BtnsBlock from "./BtnsBlock/BtnsBlock";

export default function ProfileMenuDesktop(): React.ReactElement {
  const [menuIsOpen, setMenuIsOpen] = React.useState<boolean>(false);

  const onAvatarClick: () => void = (): void => {
    setMenuIsOpen((prev: boolean): boolean => !prev);
  };

  const onCloseMenu: () => void = (): void => {
    setMenuIsOpen(false);
  };

  return (
    <ClickAwayListener<HTMLDivElement> onClickAway={onCloseMenu}>
      {(ref: React.Ref<HTMLDivElement>): React.ReactElement => (
        <div className={styles.userContainer} ref={ref}>
          <IconButton onClick={onAvatarClick}>
            <DefaultAvatar className={styles.avatarIcon} />
          </IconButton>
          <Dropdown isOpen={menuIsOpen} className={styles.dropdownProfile}>
            <UserInfoBlock />
            <BtnsBlock />
          </Dropdown>
        </div>
      )}
    </ClickAwayListener>
  );
}
