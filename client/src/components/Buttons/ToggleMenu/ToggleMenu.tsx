import React from "react";
import { ToggleMenuProps } from "./ToggleMenu.interface";
import styles from "./toggleMenu.module.css";
import classNames from "classnames";

function ToggleMenuInner(
  { isOpen, isOverlay, className, ...other }: ToggleMenuProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.ReactElement {
  const buttonStyles = classNames(styles.toggleMenuWrapper, className, {
    [styles.open]: isOpen,
    [styles.overlay]: isOverlay,
  });

  const firstLineStyles = classNames(styles.rootLine, styles.firstLine);
  const secondLineStyles = classNames(styles.rootLine, styles.secondLine);
  const thirdLineStyles = classNames(styles.rootLine, styles.thirdLine);

  return (
    <button ref={ref} className={buttonStyles} {...other}>
      <div className={firstLineStyles} />
      <div className={secondLineStyles} />
      <div className={thirdLineStyles} />
    </button>
  );
}

const ToggleMenu = React.forwardRef<HTMLButtonElement, ToggleMenuProps>(
  ToggleMenuInner,
);

export default ToggleMenu;
