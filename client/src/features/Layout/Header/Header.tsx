import React from "react";
import styles from "./header.module.css";
import sharedLayoutStyles from "./../shared/styles.module.css";
import Logotype from "./Logotype/Logotype";
import classNames from "classnames";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuth } from "@/features/Auth/auth.slice";
import ProfileMenuDesktop from "./ProfileMenuDesktop/ProfileMenuDesktop";
import ProfileMenuMobile from "./ProfileMenuMobile/ProfileMenuMobile";

export default function Header(): React.ReactElement {
  const isAuth = useAppSelector(selectIsAuth);

  const containerStyles = classNames(
    sharedLayoutStyles.layoutContainer,
    styles.headerContainer,
  );

  const contentStyles = classNames(
    sharedLayoutStyles.layoutContent,
    styles.headerContent,
  );

  return (
    <div className={containerStyles}>
      <div className={contentStyles}>
        <Logotype />
        {isAuth && (
          <>
            <ProfileMenuDesktop />
            <ProfileMenuMobile />
          </>
        )}
      </div>
    </div>
  );
}
