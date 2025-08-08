import React from "react";
import styles from "./footer.module.css";
import sharedLayoutStyles from "./../shared/styles.module.css";
import Copyright from "./Copyright/Copyright";
import Country from "./Country/Country";
import classNames from "classnames";

export default function Footer(): React.ReactElement {
  const containerStyles = classNames(
    sharedLayoutStyles.layoutContainer,
    styles.footerContainer,
  );

  return (
    <div className={containerStyles}>
      <div className={sharedLayoutStyles.layoutContent}>
        <Copyright />
        <Country />
      </div>
    </div>
  );
}
