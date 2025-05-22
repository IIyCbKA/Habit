import React from "react";
import styles from "./dropdown.module.css";
import sharedStyles from "@/shared/shared.module.css";
import { DropdownProps } from "./Dropdown.interface";
import classNames from "classnames";

export default function Dropdown({
  show,
  className,
  ...other
}: DropdownProps): React.ReactElement {
  const wrapStyles = classNames(styles.dropdownWrap, className, {
    [sharedStyles.show]: show,
    [sharedStyles.hidden]: !show,
  });

  return (
    <div {...other} className={wrapStyles}>
      <div className={styles.dropdownContainer}>Text</div>
    </div>
  );
}
