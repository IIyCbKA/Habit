import React from "react";
import styles from "./auth.module.css";
import { FORM_COMPONENTS } from "./auth.constants";
import { useAppSelector } from "@/store/hooks";
import { selectAuthScreen } from "@/features/uiState/uiState.slice";
import LinkTo from "@/components/Link/LinkTo";
import { PUBLIC_PATHS } from "@/routes/publicRoutes.constants";
import Logotype from "@/assets/icons/heart_128x128.svg?react";

export default function Auth(): React.ReactElement {
  const formType = useAppSelector(selectAuthScreen);
  const FormComponent: React.FC = FORM_COMPONENTS[formType];

  return (
    <div className={styles.authContentWrap}>
      <LinkTo className={styles.logo} to={PUBLIC_PATHS.DEFAULT}>
        <Logotype />
      </LinkTo>
      <FormComponent />
    </div>
  );
}
