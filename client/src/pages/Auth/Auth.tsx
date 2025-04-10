import React from "react";
import styles from "./Auth.module.css";
import SignInForm from "./SignInForm/SignInForm";

export default function Auth(): React.ReactElement {
  return (
    <div className={styles.authContentWrap}>
      <SignInForm />
    </div>
  );
}