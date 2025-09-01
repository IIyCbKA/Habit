import React from "react";
import styles from "./styles.module.css";
import MenuDropdown from "./MenuDropdown";
import MenuDrawer from "./MenuDrawer";
import { PATHS } from "@/routes/paths";
import { Link } from "react-router-dom";
import { Logotype } from "@/assets/icons";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuth } from "@/features/Auth/slice";

export default function Header(): React.ReactElement | null {
  const isAuth = useAppSelector(selectIsAuth);

  if (!isAuth) return null;

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link to={PATHS.DASHBOARD} className={styles.logotypeWrap}>
          <Logotype className={styles.logotypeImg} />
        </Link>
        <MenuDropdown />
        <MenuDrawer />
      </div>
    </div>
  );
}
