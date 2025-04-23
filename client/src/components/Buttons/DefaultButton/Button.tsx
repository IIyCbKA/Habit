import React from "react";
import styles from "./button.module.css";
import sharedStyles from "@/shared/shared.module.css";
import classNames from "classnames";
import { ButtonProps } from "./Button.interface";
import { ButtonVariant } from "./button.enums";
import { ButtonType } from "../shared.enums";

export default function Button({
  disabled,
  fullWidth,
  children,
  className,
  onClick,
  type = ButtonType.Button,
  variant = ButtonVariant.Text,
}: ButtonProps): React.ReactElement {
  const buttonStyles = classNames(
    styles.rootButton,
    sharedStyles.defaultText,
    className,
    {
      [styles.fullWidth]: fullWidth,
      [styles.containedButton]: variant === ButtonVariant.Contained,
      [styles.textButton]: variant === ButtonVariant.Text,
      [styles.outlinedButton]: variant === ButtonVariant.Outlined,
    },
  );

  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
