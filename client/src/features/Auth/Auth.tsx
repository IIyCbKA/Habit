import React from "react";
import styles from "./auth.module.css";
import { FORM_COMPONENTS } from "./auth.constants";
import { useAppSelector } from "@/store/hooks";
import { selectAuthForm } from "@/features/uiState/uiState.slice";

export default function Auth(): React.ReactElement {
  const formType = useAppSelector(selectAuthForm);
  const FormComponent: React.FC = FORM_COMPONENTS[formType];

  return (
    <div className={styles.authContentWrap}>
      <FormComponent />
    </div>
  );
}
