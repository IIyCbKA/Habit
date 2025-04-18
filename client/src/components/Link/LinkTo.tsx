import React from "react";
import { Link } from "react-router-dom";
import { LinkToProps } from "@/components/Link/LinkTo.interface";
import styles from "./LinkTo.module.css";
import sharedStyles from "@/shared/styles.module.css";
import classNames from "classnames";

export default function LinkTo({
  children,
  path,
  className,
}: LinkToProps): React.ReactElement {
  const linkStyles = classNames(
    styles.linkToRoot,
    sharedStyles.defaultText,
    className,
  );

  return (
    <Link to={path} className={linkStyles}>
      {children}
    </Link>
  );
}
