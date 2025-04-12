import React from "react";
import styles from "./Button.module.css";
import sharedStyles from "@/shared/styles.module.css";
import classNames from "classnames";
import { ButtonData } from "./Button.interface";
import { BUTTON_TYPE } from "./Button.constants";

export default function Button({
  children,
  disabled,
  fullWidth,
  variant = BUTTON_TYPE.text,
  className,
  onClick,
}: ButtonData): React.ReactElement {
  const buttonStyles = classNames(
    styles.rootButton,
    sharedStyles.defaultText,
    className,
    {
      [styles.fullWidth]: fullWidth,
      [styles.containedButton]: variant === BUTTON_TYPE.contained,
      [styles.textButton]: variant === BUTTON_TYPE.text,
      [styles.outlinedButton]: variant === BUTTON_TYPE.outlined,
    },
  );

  return (
    <button className={buttonStyles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
