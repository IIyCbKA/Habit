import React from "react";
import styles from "./copyright.module.css";
import sharedStyles from "@/shared/shared.module.css";
import classNames from "classnames";
import { COPYRIGHT_TEXT } from "./copyright.constants";

export default function Copyright(): React.ReactElement {
  const textStyles = classNames(styles.copyrightWrap, sharedStyles.lowerText);

  return <div className={textStyles}>{COPYRIGHT_TEXT}</div>;
}
