import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "@/shared/constants/Routes.constants";
import Heart from "@/assets/icons/heart_128x128.svg?react";
import styles from "./Logotype.module.css";

export default function Logotype(): React.ReactElement {
  return (
    <Link to={PATHS.DEFAULT} className={styles.logotypeWrap}>
      <Heart className={styles.logotypeImg} />
    </Link>
  );
}