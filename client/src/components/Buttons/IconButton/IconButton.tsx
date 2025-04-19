import React from "react";
import { IconButtonProps } from "./IconButton.interface";
import styles from "./IconButton.module.css";
import classNames from "classnames";
import { ButtonType } from "@/components/Buttons/shared.enums";

export default function IconButton({
  children,
  disabled,
  className,
  onClick,
  type = ButtonType.Button,
}: IconButtonProps): React.ReactElement {
  const buttonStyles = classNames(styles.iconButtonRoot, className);

  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
