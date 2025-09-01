import React from "react";
import { LinearProgressProps } from "./interface";
import styles from "./styles.module.css";
import classNames from "classnames";

function LinearProgressInner(
  { value, className, ...other }: LinearProgressProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const containerStyles = classNames(styles.container, className);

  const progressTransform = {
    transform: `scaleX(${value / 100})`,
  } as React.CSSProperties;

  return (
    <div ref={ref} className={containerStyles} {...other}>
      <div className={styles.progress} style={progressTransform} />
    </div>
  );
}

const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  LinearProgressInner,
);

export default LinearProgress;
