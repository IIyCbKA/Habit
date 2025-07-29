import React from "react";
import styles from "./button.module.css";
import sharedStyles from "@/shared/shared.module.css";
import classNames from "classnames";
import { ButtonProps } from "./Button.interface";
import {
  Adornment,
  LoadingSpinnerProps,
  PositionedAdornmentProps,
} from "./button.types";
import CircularProgress from "@/components/Progress/CircularProgress/CircularProgress";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";

function AdornmentIcon({
  content,
  className,
  position,
}: PositionedAdornmentProps): React.ReactElement | null {
  const adornmentStyles = classNames(styles.adornmentContainer, className, {
    [styles.startAdornment]: position === "start",
    [styles.endAdornment]: position === "end",
  });

  if (!content) return null;
  return <div className={adornmentStyles}>{content}</div>;
}

function LoadingSpinner({
  isLoading,
}: LoadingSpinnerProps): React.ReactElement | null {
  if (!isLoading) return null;

  return (
    <span className={styles.loadingWrap}>
      <CircularProgress className={styles.spinner} />
    </span>
  );
}

function ButtonInner(
  {
    disabled,
    isLoading,
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
  const isDisabled = disabled || isLoading;

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
      [styles.loading]: isLoading,
    },
  );

  return (
    <button
      {...other}
      ref={ref}
      disabled={isDisabled}
      type={type}
      className={buttonStyles}
    >
      <AdornmentIcon position={"start"} {...startIcon} />
      {children}
      <AdornmentIcon position={"end"} {...endIcon} />
      <LoadingSpinner isLoading={isLoading} />
    </button>
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(ButtonInner);

export default Button;
