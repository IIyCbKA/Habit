import React from "react";
import ToggleMenu from "@/components/Buttons/ToggleMenu/ToggleMenu";
import styles from "./menuDrawer.module.css";
import Drawer from "@/components/Drawer/Drawer";
import RootBlock from "./RootBlock/RootBlock";
import NavigationBlock from "./NavigationBlock/NavigationBlock";
import ServiceBlock from "./ServiceBlock/ServiceBlock";

export default function MenuDrawer(): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggleClick: () => void = (): void => {
    setIsOpen((prev: boolean): boolean => !prev);
  };

  return (
    <div className={styles.rootContainer}>
      <ToggleMenu isOverlay isOpen={isOpen} onClick={onToggleClick} />
      <Drawer className={styles.drawerContent} isOpen={isOpen}>
        <RootBlock />
        <NavigationBlock />
        <ServiceBlock />
      </Drawer>
    </div>
  );
}
