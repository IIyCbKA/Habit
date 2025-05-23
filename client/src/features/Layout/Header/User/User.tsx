import React from "react";
import styles from "./user.module.css";
import sharedStyles from "@/shared/shared.module.css";
import IconButton from "@/components/Buttons/IconButton/IconButton";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";
import Dropdown from "@/components/Dropdown/Dropdown";
import ClickAwayListener from "@/components/ClickAwayListener/ClickAwayListener";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, selectUser } from "@/features/Auth/auth.slice";
import classNames from "classnames";
import Button from "@/components/Buttons/DefaultButton/Button";
import { SIGN_OUT_BTN } from "@/features/Layout/Header/User/user.constants";

export default function User(): React.ReactElement {
  const [menuIsOpen, setMenuIsOpen] = React.useState<boolean>(false);
  const username = useAppSelector(selectUser)?.username;
  const dispatch = useAppDispatch();

  const usernameStyles = classNames(
    sharedStyles.upperText,
    styles.profileUsername,
  );

  const onAvatarClick: () => void = (): void => {
    setMenuIsOpen((prev: boolean): boolean => !prev);
  };

  const onCloseMenu: () => void = (): void => {
    setMenuIsOpen(false);
  };

  const onSignOut: () => void = (): void => {
    dispatch(logout());
  };

  return (
    <ClickAwayListener<HTMLDivElement> onClickAway={onCloseMenu}>
      {(ref: React.Ref<HTMLDivElement>): React.ReactElement => (
        <div className={styles.userContainer} ref={ref}>
          <IconButton onClick={onAvatarClick}>
            <DefaultAvatar className={styles.iconBtnContainer} />
          </IconButton>
          {menuIsOpen && (
            <Dropdown show={menuIsOpen}>
              <div className={styles.profileInfoContainer}>
                <DefaultAvatar className={styles.profileIconContainer} />
                <div className={usernameStyles}>{username}</div>
              </div>
              <Button fullWidth onClick={onSignOut}>
                {SIGN_OUT_BTN}
              </Button>
            </Dropdown>
          )}
        </div>
      )}
    </ClickAwayListener>
  );
}
