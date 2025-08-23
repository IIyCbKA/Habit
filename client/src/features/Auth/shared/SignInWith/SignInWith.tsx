import React from "react";
import styles from "./signInWith.module.css";
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock";
import { TITLE_TEXT } from "./signInWith.constants";

export default function SignInWith(): React.ReactElement {
  return (
    <div className={styles.signInWithContainer}>
      <span className={styles.titleRoot}>{TITLE_TEXT}</span>
      <ButtonsBlock />
    </div>
  );
}
