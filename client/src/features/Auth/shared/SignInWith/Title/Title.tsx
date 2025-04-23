import React from "react";
import { TITLE_TEXT } from "./title.constants";
import styles from "./title.module.css";
import sharedStyles from "@/shared/shared.module.css";
import classNames from "classnames";

export default function Title(): React.ReactElement {
  const titleStyles = classNames(styles.titleRoot, sharedStyles.lowerText);

  return <span className={titleStyles}>{TITLE_TEXT}</span>;
}
