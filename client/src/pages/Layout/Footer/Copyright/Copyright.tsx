import React from "react";
import styles from "./Copyright.module.css";
import sharedStyles from "@/shared/styles.module.css";
import classNames from "classnames";
import { COPYRIGHT_TEXT } from "./Copyright.constants";

export default function Copyright(): React.ReactElement {
  const textStyles = classNames(styles.copyrightWrap, sharedStyles.lowerText);

  return <div className={textStyles}>{COPYRIGHT_TEXT}</div>;
}
