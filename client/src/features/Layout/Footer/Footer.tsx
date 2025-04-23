import React from "react";
import styles from "./footer.module.css";
import sharedLayoutStyles from "./../shared/styles.module.css";
import Copyright from "@/features/Layout/Footer/Copyright/Copyright";
import Country from "@/features/Layout/Footer/Country/Country";
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
