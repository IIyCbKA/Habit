import React from "react";
import styles from "./SignInWith.module.css";
import Title from "./Title/Title";

export default function SignInWith(): React.ReactElement {
  return (
    <div className={styles.signInWithContainer}>
      <Title />
    </div>
  );
}
