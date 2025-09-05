import React from "react";
import Header from "./Header";
import { Outlet, useNavigation } from "react-router-dom";
import styles from "./styles.module.css";
import { LoadingOverlay } from "@/components";

export default function Layout(): React.ReactElement {
  const nav = useNavigation();
  const pending = nav.state !== "idle";

  return (
    <div className={styles.rootContainer}>
      <Header />
      {pending && <LoadingOverlay />}
      <div className={styles.contentWrap}>
        <Outlet />
      </div>
    </div>
  );
}
