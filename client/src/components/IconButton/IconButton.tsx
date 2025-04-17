import React from "react";
import { IconButtonData } from "./IconButton.interface";
import styles from "./IconButton.module.css";
import classNames from "classnames";

export default function IconButton({
  children,
  disabled,
  className,
  onClick,
}: IconButtonData): React.ReactElement {
  const buttonStyles = classNames(styles.iconButtonRoot, className);

  return (
    <button className={buttonStyles} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
