import React from "react";
import CircularProgress from "@/components/Progress/CircularProgress/CircularProgress";
import { LoadingOverlayProps } from "./LoadingOverlay.interface";
import styles from "./loadingOverlay.module.css";
import classNames from "classnames";
import { LoadingOverlayVariant } from "./loadingOverlay.enums";

function LoadingOverlayInner(
  {
    overlayType = LoadingOverlayVariant.FullParent,
    className,
    ...other
  }: LoadingOverlayProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const overlayStyles = classNames(styles.loadingOverlayRoot, className, {
    [styles.fullParent]: overlayType === LoadingOverlayVariant.FullParent,
    [styles.fullPage]: overlayType === LoadingOverlayVariant.FullPage,
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
