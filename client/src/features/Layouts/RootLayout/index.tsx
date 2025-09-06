import React from "react";
import Header from "@/features/Layouts/AuthVerifiedLayout/Header";
import { Outlet, useNavigation } from "react-router-dom";
import styles from "./styles.module.css";
import { LoadingOverlay } from "@/components";

export default function RootLayout(): React.ReactElement {
  const nav = useNavigation();
  const pending = nav.state !== "idle";

  return (
    <div className={styles.rootContainer}>
      {pending && <LoadingOverlay />}
      <Outlet />
    </div>
  );
}
