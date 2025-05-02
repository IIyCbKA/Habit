import React from "react";
import styles from "./header.module.css";
import sharedLayoutStyles from "./../shared/styles.module.css";
import Logotype from "./Logotype/Logotype";
import classNames from "classnames";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuth } from "@/features/Auth/auth.slice";
import User from "./User/User";

export default function Header(): React.ReactElement {
  const isAuth = useAppSelector(selectIsAuth);

  const containerStyles = classNames(
    sharedLayoutStyles.layoutContainer,
    styles.headerContainer,
  );

  return (
    <div className={containerStyles}>
      <div className={sharedLayoutStyles.layoutContent}>
        <Logotype />
        {isAuth && <User />}
      </div>
    </div>
  );
}
