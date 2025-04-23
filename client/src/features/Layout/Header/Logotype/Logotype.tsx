import React from "react";
import { Link } from "react-router-dom";
import { PUBLIC_PATHS } from "@/routes/publicRoutes.constants";
import Heart from "@/assets/icons/heart_128x128.svg?react";
import styles from "./logotype.module.css";

export default function Logotype(): React.ReactElement {
  return (
    <Link to={PUBLIC_PATHS.DEFAULT} className={styles.logotypeWrap}>
      <Heart className={styles.logotypeImg} />
    </Link>
  );
}
