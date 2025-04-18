import React from "react";
import styles from "./Button.module.css";
import sharedStyles from "@/shared/styles.module.css";
import classNames from "classnames";
import { ButtonProps } from "./Button.interface";
import { ButtonType } from "./Button.enums";

export default function Button({
  children,
  disabled,
  fullWidth,
  variant = ButtonType.Text,
  className,
  onClick,
}: ButtonProps): React.ReactElement {
  const buttonStyles = classNames(
    styles.rootButton,
    sharedStyles.defaultText,
    className,
    {
      [styles.fullWidth]: fullWidth,
      [styles.containedButton]: variant === ButtonType.Contained,
      [styles.textButton]: variant === ButtonType.Text,
      [styles.outlinedButton]: variant === ButtonType.Outlined,
    },
  );

  return (
    <button className={buttonStyles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
