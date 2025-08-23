import React from "react";
import { TypographyProps } from "./Typography.interface";
import styles from "./typography.module.css";
import classNames from "classnames";

function TypographyInner(
  { variant = "h2", children, className, ...other }: TypographyProps,
  ref: React.ForwardedRef<HTMLHeadingElement>,
): React.ReactElement {
  const Tag = variant;
  const rootStyles = classNames(styles.title, className);

  return (
    <Tag ref={ref} className={rootStyles} {...other}>
      {children}
    </Tag>
  );
}

const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  TypographyInner,
);

export default Typography;
