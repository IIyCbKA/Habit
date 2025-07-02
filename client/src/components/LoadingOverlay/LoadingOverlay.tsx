import React from "react";
import CircularProgress from "@/components/Progress/CircularProgress/CircularProgress";
import { LoadingOverlayProps } from "./LoadingOverlay.interface";
import styles from "./loadingOverlay.module.css";
import classNames from "classnames";

function LoadingOverlayInner(
  { overlayType = "fullparent", className, ...other }: LoadingOverlayProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const overlayStyles = classNames(styles.loadingOverlayRoot, className, {
    [styles.fullParent]: overlayType === "fullparent",
    [styles.fullPage]: overlayType === "fullpage",
  });

  return (
    <div ref={ref} {...other} className={overlayStyles}>
      <CircularProgress />
    </div>
  );
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  LoadingOverlayInner,
);

export default LoadingOverlay;
