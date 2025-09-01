import React from "react";
import { IconButtonProps } from "./interface";
import styles from "./styles.module.css";
import classNames from "classnames";

function IconButtonInner(
  { className, type = "button", ...other }: IconButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.ReactElement {
  const buttonStyles = classNames(styles.iconButtonRoot, className);

  return <button {...other} ref={ref} type={type} className={buttonStyles} />;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  IconButtonInner,
);

export default IconButton;
