import React, { ForwardedRef } from "react";
import { Link } from "react-router-dom";
import { LinkToProps } from "./interface";
import styles from "./styles.module.css";
import classNames from "classnames";

function LinkToInner(
  { className, ...other }: LinkToProps,
  ref: ForwardedRef<HTMLAnchorElement>,
): React.ReactElement {
  const linkStyles = classNames(styles.linkToRoot, className);

  return <Link {...other} ref={ref} className={linkStyles} />;
}

const LinkTo = React.forwardRef<HTMLAnchorElement, LinkToProps>(LinkToInner);

export default LinkTo;
