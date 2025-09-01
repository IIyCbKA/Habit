import React from "react";
import styles from "./styles.module.css";
import { Drawer, ToggleMenu } from "@/components";
import RootBlock from "./RootBlock";
import NavigationBlock from "./NavigationBlock";
import ServiceBlock from "./ServiceBlock";

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
