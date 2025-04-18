import React from "react";
import styles from "./SignInWith.module.css";
import Title from "./Title/Title";
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock";

export default function SignInWith(): React.ReactElement {
  return (
    <div className={styles.signInWithContainer}>
      <Title />
      <ButtonsBlock />
    </div>
  );
}
