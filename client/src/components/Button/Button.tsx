import React from "react";
import style from "./Button.module.css";
import classNames from "classnames";
import { ButtonData } from "./Button.interface";
import { BUTTON_TYPE } from "./Button.constants";

export default function Button({
  children,
  disabled,
  fullWidth,
  variant = BUTTON_TYPE.TEXT,
  className,
  onClick,
}: ButtonData): React.ReactElement {
  const buttonStyles = classNames(style.rootButton, className, {
    [style.fullWidth]: fullWidth,
    [style.containedButton]: variant == BUTTON_TYPE.CONTAINED,
    [style.textButton]: variant == BUTTON_TYPE.TEXT,
    [style.outlinedButton]: variant == BUTTON_TYPE.OUTLINED,
  });

  return (
    <button className={buttonStyles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
