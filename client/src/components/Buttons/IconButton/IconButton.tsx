import React from "react";
import { IconButtonProps } from "./IconButton.interface";
import styles from "./iconButton.module.css";
import classNames from "classnames";
import { ButtonType } from "@/components/Buttons/shared.enums";

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, type = ButtonType.Button, ...other }: IconButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ): React.ReactElement => {
    const buttonStyles = classNames(styles.iconButtonRoot, className);

    return <button {...other} ref={ref} type={type} className={buttonStyles} />;
  },
);

export default IconButton;
