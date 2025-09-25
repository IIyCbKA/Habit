import React from "react";
import styles from "./styles.module.css";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Divider } from "@/components";

export default function Account(): React.ReactElement {
  return (
    <div className={styles.accountContentWrap}>
      <div className={styles.accountContent}>
        <Header />
        <Divider className={styles.contentDivider} />
        <Outlet />
      </div>
    </div>
  );
}
