import React from "react";
import styles from "./menuDropdown.module.css";
import Button from "@/components/Buttons/Button/Button";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";
import ChevronDown from "@/assets/icons/chevron_down_64x64.svg?react";
import Dropdown from "@/components/Dropdown/Dropdown";
import ClickAwayListener from "@/components/ClickAwayListener/ClickAwayListener";
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock";
import { useAppSelector } from "@/store/hooks";
import { selectUsername } from "@/features/Auth/auth.slice";

export default function MenuDropdown(): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const username = useAppSelector(selectUsername);

  const onAvatarClick: () => void = (): void => {
    setIsOpen((prev: boolean): boolean => !prev);
  };

  const onCloseMenu: () => void = (): void => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener<HTMLDivElement> onClickAway={onCloseMenu}>
      {(ref: React.Ref<HTMLDivElement>): React.ReactElement => (
        <div className={styles.rootContainer} ref={ref}>
          <Button
            variant={"plain"}
            className={styles.dropdownToggle}
            onClick={onAvatarClick}
            endIcon={{
              content: (
                <span className={styles.toggleEndIconContainer}>
                  <DefaultAvatar />
                  <ChevronDown className={styles.dropdownChevron} />
                </span>
              ),
            }}
          >
            {username}
          </Button>
          <Dropdown isOpen={isOpen} className={styles.dropdownContent}>
            <ButtonsBlock />
          </Dropdown>
        </div>
      )}
    </ClickAwayListener>
  );
}
