import React from "react";
import styles from "./circularProgress.module.css";
import Circle from "@/assets/icons/circle_64x64.svg?react";
import { CircularProgressProps } from "./CircularProgress.interface";
import classNames from "classnames";

function CircularProgressInner(
  { className, ...other }: CircularProgressProps,
  ref: React.ForwardedRef<HTMLSpanElement>,
): React.ReactElement {
  const wrapStyles = classNames(styles.circularProgressWrap, className);

  return (
    <span ref={ref} {...other} className={wrapStyles}>
      <Circle className={styles.circularProgressRoot} />
    </span>
  );
}

const CircularProgress = React.forwardRef<
  HTMLSpanElement,
  CircularProgressProps
>(CircularProgressInner);

export default CircularProgress;
