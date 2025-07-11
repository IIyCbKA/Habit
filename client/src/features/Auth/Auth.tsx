import React from "react";
import styles from "./auth.module.css";
import SignInForm from "./SignInForm/SignInForm";
import SignUpForm from "./SignUpForm/SignUpForm";
import { FormProps } from "./shared/shared.interfaces";
import { Form } from "./auth.types";

export default function Auth(): React.ReactElement {
  const [formType, setFormType] = React.useState<Form>("signIn");

  const toggleFormType: () => void = React.useCallback((): void => {
    setFormType(
      (prev: Form): Form => (prev === "signIn" ? "signUp" : "signIn"),
    );
  }, []);

  const FormComponent: ({ toggleFormType }: FormProps) => React.ReactElement =
    formType === "signIn" ? SignInForm : SignUpForm;

  return (
    <div className={styles.authContentWrap}>
      <FormComponent toggleFormType={toggleFormType} />
    </div>
  );
}
