import React from "react";
import ToggleMenu from "@/components/Buttons/ToggleMenu/ToggleMenu";
import styles from "./profileMenuMobile.module.css";
import Drawer from "@/components/Drawer/Drawer";
import UserInfoBlock from "./UserInfoBlock/UserInfoBlock";
import Divider from "@/components/Divider/Divider";
import NavigationBtnsBlock from "./NavigationBtnsBlock/NavigationBtnsBlock";
import ServiceBtnsBlock from "./ServiceBtnsBlock/ServiceBtnsBlock";

export default function ProfileMenuMobile(): React.ReactElement {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);

  const onToggleClick: () => void = (): void => {
    setMenuIsOpen((prev: boolean): boolean => !prev);
  };

  return (
    <div className={styles.menu}>
      <ToggleMenu isOverlay isOpen={menuIsOpen} onClick={onToggleClick} />
      <Drawer isOpen={menuIsOpen}>
        <div className={styles.menuContainer}>
          <UserInfoBlock />
          <Divider className={styles.dividerWrap} />
          <NavigationBtnsBlock />
          <Divider className={styles.dividerWrap} />
          <ServiceBtnsBlock />
        </div>
      </Drawer>
    </div>
  );
}
