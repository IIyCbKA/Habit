import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./styles.module.css";
import { PATHS } from "@/routes/paths";
import { Logotype } from "@/assets/icons";
import { LinkTo } from "@/components";

export default function Auth(): React.ReactElement {
  return (
    <div className={styles.authContentWrap}>
      <LinkTo className={styles.logo} to={PATHS.SIGN_IN}>
        <Logotype />
      </LinkTo>
      <Outlet />
    </div>
  );
}
