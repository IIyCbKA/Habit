import React from "react";
import styles from "./divider.module.css";
import { DividerProps } from "./Divider.interface";
import classNames from "classnames";
import {
  DIV_ELEMENT,
  DIVIDER_ORIENTATIONS,
  DIVIDER_VARIANTS,
  HR_ELEMENT,
} from "./divider.constants";

export default function Divider({
  flexItem,
  orientation = DIVIDER_ORIENTATIONS.horizontal,
  variant = DIVIDER_VARIANTS.fullWidth,
  className,
}: DividerProps): React.ReactElement {
  const Component: React.ElementType =
    orientation === DIVIDER_ORIENTATIONS.horizontal ? HR_ELEMENT : DIV_ELEMENT;

  const orientationClasses =
    orientation === DIVIDER_ORIENTATIONS.horizontal
      ? classNames(
          styles.dividerHorizontal,
          variant === DIVIDER_VARIANTS.inset && styles.dividerHorizontalInset,
          variant === DIVIDER_VARIANTS.middle && styles.dividerHorizontalMiddle,
          flexItem && styles.dividerHorizontalFlex,
        )
      : classNames(
          styles.dividerVertical,
          variant === DIVIDER_VARIANTS.fullWidth &&
            styles.dividerVerticalFullWidth,
          variant === DIVIDER_VARIANTS.middle && styles.dividerVerticalMiddle,
          variant === DIVIDER_VARIANTS.inset && styles.dividerVerticalInset,
          flexItem && styles.dividerVerticalFlex,
        );

  const dividerStyles = classNames(
    styles.dividerRoot,
    orientationClasses,
    className,
  );

  return <Component className={dividerStyles} />;
}
