import React from "react";
import styles from "./button.module.css";
import sharedStyles from "@/shared/shared.module.css";
import classNames from "classnames";
import { ButtonProps } from "./Button.interface";
import { ButtonVariant } from "./button.enums";
import { ButtonType } from "../shared.enums";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      fullWidth,
      className,
      type = ButtonType.Button,
      variant = ButtonVariant.Text,
      ...other
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ): React.ReactElement => {
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

    return <button {...other} ref={ref} type={type} className={buttonStyles} />;
  },
);

export default Button;
