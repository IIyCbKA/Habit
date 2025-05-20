import React from "react";
import styles from "./circularProgress.module.css";
import Circle from "@/assets/icons/circle_64x64.svg?react";
import { CircularProgressProps } from "./CircularProgress.interface";
import classNames from "classnames";

export default function CircularProgress({
  className,
  ...other
}: CircularProgressProps): React.ReactElement {
  const wrapStyles = classNames(styles.circularProgressWrap, className);

  return (
    <span {...other} className={wrapStyles}>
      <Circle className={styles.circularProgressRoot} />
    </span>
  );
}
