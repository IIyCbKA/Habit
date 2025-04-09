import React from "react";
import styles from "./Header.module.css";
import sharedLayoutStyles from "./../shared/styles.module.css";
import Logotype from "./Logotype/Logotype";
import classNames from "classnames";

export default function Header(): React.ReactElement {
  const containerStyles = classNames(
    sharedLayoutStyles.layoutContainer,
    styles.headerContainer,
  );

  return (
    <div className={containerStyles}>
      <div className={sharedLayoutStyles.layoutContent}>
        <Logotype />
      </div>
    </div>
  );
}