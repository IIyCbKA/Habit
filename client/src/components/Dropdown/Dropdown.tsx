import React from "react";
import styles from "./dropdown.module.css";
import sharedStyles from "@/shared/shared.module.css";
import { DropdownProps } from "./Dropdown.interface";
import classNames from "classnames";

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    { show, children, className, ...other }: DropdownProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ): React.ReactElement => {
    const wrapStyles = classNames(styles.dropdownWrap, className, {
      [sharedStyles.show]: show,
      [sharedStyles.hidden]: !show,
    });

    return (
      <div {...other} ref={ref} className={wrapStyles}>
        <div className={styles.dropdownContainer}>{children}</div>
      </div>
    );
  },
);

export default Dropdown;
