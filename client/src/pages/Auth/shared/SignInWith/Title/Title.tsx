import React from "react";
import { TITLE_TEXT } from "./Title.constants";
import styles from "./Title.module.css";
import sharedStyles from "@/shared/styles.module.css";
import classNames from "classnames";

export default function Title(): React.ReactElement {
  const titleStyles = classNames(styles.titleRoot, sharedStyles.lowerText);

  return <span className={titleStyles}>{TITLE_TEXT}</span>;
}
