import React from "react";
import CircularProgress from "@/components/Progress/CircularProgress/CircularProgress";
import { LoadingOverlayProps } from "./LoadingOverlay.interface";
import styles from "./loadingOverlay.module.css";
import classNames from "classnames";
import { LoadingOverlayVariant } from "./loadingOverlay.enums";

export default function LoadingOverlay({
  overlayType = LoadingOverlayVariant.FullParent,
  className,
  ...other
}: LoadingOverlayProps): React.ReactElement {
  const overlayStyles = classNames(styles.loadingOverlayRoot, className, {
    [styles.fullParent]: overlayType === LoadingOverlayVariant.FullParent,
    [styles.fullPage]: overlayType === LoadingOverlayVariant.FullPage,
  });

  return (
    <div {...other} className={overlayStyles}>
      <CircularProgress />
    </div>
  );
}
