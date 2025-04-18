import React from "react";
import styles from "./Auth.module.css";
import SignInForm from "./SignInForm/SignInForm";
import SignUpForm from "./SignUpForm/SignUpForm";
import { FormType } from "./Auth.enums";

export default function Auth(): React.ReactElement {
  const [formType, setFormType] = React.useState(FormType.SignIn);

  // mb refactor?
  const onClickChangeFormSignIn: () => void = () => {
    setFormType(FormType.SignUp);
  };

  const onClickChangeFormSignUp: () => void = () => {
    setFormType(FormType.SignIn);
  };

  return (
    <div className={styles.authContentWrap}>
      {formType === FormType.SignIn && (
        <SignInForm onClickChangeForm={onClickChangeFormSignIn} />
      )}
      {formType === FormType.SignUp && (
        <SignUpForm onClickChangeForm={onClickChangeFormSignUp} />
      )}
    </div>
  );
}
