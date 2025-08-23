import React from "react";
import Header from "./Header/Header";
import { Outlet } from "react-router-dom";
import styles from "./layout.module.css";

export default function Layout(): React.ReactElement {
  return (
    <div className={styles.rootContainer}>
      <Header />
      <div className={styles.contentWrap}>
        <Outlet />
      </div>
    </div>
  );
}
