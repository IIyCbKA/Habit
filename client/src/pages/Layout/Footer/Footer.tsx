import React from "react";
import styles from "./Footer.module.css";
import sharedLayoutStyles from "./../shared/styles.module.css";
import Copyright from "@/pages/Layout/Footer/Copyright/Copyright";
import Country from "@/pages/Layout/Footer/Country/Country";
import classNames from "classnames";

export default function Footer(): React.ReactElement {
  const containerStyles = classNames(
    sharedLayoutStyles.layoutContainer,
    styles.footerContainer,
  );

  const contentStyles = classNames(
    sharedLayoutStyles.layoutContent,
    styles.footerContent,
  );

  return (
    <div className={containerStyles}>
      <div className={contentStyles}>
        <Copyright />
        <Country />
      </div>
    </div>
  );
}