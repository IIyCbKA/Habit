import React from "react";
import styles from "./dropdown.module.css";
import sharedStyles from "@/shared/shared.module.css";
import { DropdownProps } from "./Dropdown.interface";
import classNames from "classnames";

function DropdownInner(
  { show, children, className, ...other }: DropdownProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const wrapStyles = classNames(styles.dropdownWrap, className, {
    [sharedStyles.show]: show,
    [sharedStyles.hidden]: !show,
  });

  return (
    <div {...other} ref={ref} className={wrapStyles}>
      <div className={styles.dropdownContainer}>{children}</div>
    </div>
  );
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(DropdownInner);

export default Dropdown;
