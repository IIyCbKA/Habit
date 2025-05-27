import React from "react";
import ToggleMenu from "@/components/Buttons/ToggleMenu/ToggleMenu";
import styles from "./profileMenuMobile.module.css";
import Drawer from "@/components/Drawer/Drawer";

export default function ProfileMenuMobile(): React.ReactElement {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);

  const onToggleClick: () => void = (): void => {
    setMenuIsOpen((prev: boolean): boolean => !prev);
  };

  return (
    <div className={styles.menuContainer}>
      <ToggleMenu isOverlay isOpen={menuIsOpen} onClick={onToggleClick} />
      <Drawer isOpen={menuIsOpen} />
    </div>
  );
}
