import React from "react";
import styles from "./button.module.css";
import sharedStyles from "@/shared/shared.module.css";
import classNames from "classnames";
import { ButtonProps } from "./Button.interface";
import { PositionedAdornment } from "./button.types";

function AdornmentIcon({
  content,
  className,
  position,
}: PositionedAdornment): React.ReactElement | null {
  const adornmentStyles = classNames(styles.adornmentContainer, className, {
    [styles.startAdornment]: position === "start",
    [styles.endAdornment]: position === "end",
  });

  if (!content) return null;
  return <div className={adornmentStyles}>{content}</div>;
}

function ButtonInner(
  {
    fullWidth,
    children,
    className,
    type = "button",
    endIcon,
    startIcon,
    variant = "text",
    ...other
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.ReactElement {
  const buttonStyles = classNames(
    styles.rootButton,
    sharedStyles.defaultText,
    className,
    {
      [styles.fullWidth]: fullWidth,
      [styles.containedButton]: variant === "contained",
      [styles.textButton]: variant === "text",
      [styles.outlinedButton]: variant === "outlined",
      [styles.buttonWithAdornment]: startIcon || endIcon,
    },
  );

  return (
    <button {...other} ref={ref} type={type} className={buttonStyles}>
      <AdornmentIcon position={"start"} {...startIcon} />
      {children}
      <AdornmentIcon position={"end"} {...endIcon} />
    </button>
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(ButtonInner);

export default Button;
