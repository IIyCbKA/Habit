import React from "react";
import styles from "./header.module.css";
import ProfileMenuDesktop from "./ProfileMenuDesktop/ProfileMenuDesktop";
import ProfileMenuMobile from "./ProfileMenuMobile/ProfileMenuMobile";
import { PUBLIC_PATHS } from "@/routes/publicRoutes.constants";
import { Link } from "react-router-dom";
import Heart from "@/assets/icons/heart_128x128.svg?react";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuth } from "@/features/Auth/auth.slice";

export default function Header(): React.ReactElement | null {
  const isAuth = useAppSelector(selectIsAuth);

  if (!isAuth) return null;

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link to={PUBLIC_PATHS.DEFAULT} className={styles.logotypeWrap}>
          <Heart className={styles.logotypeImg} />
        </Link>
        <ProfileMenuDesktop />
        <ProfileMenuMobile />
      </div>
    </div>
  );
}
