import React from "react";
import styles from "./auth.module.css";
import SignInForm from "./SignInForm/SignInForm";
import SignUpForm from "./SignUpForm/SignUpForm";
import { FormType } from "./auth.enums";
import { FormProps } from "./shared/shared.interfaces";

export default function Auth(): React.ReactElement {
  const [formType, setFormType] = React.useState<FormType>(FormType.SignIn);

  const toggleFormType: () => void = React.useCallback((): void => {
    setFormType(
      (prev: FormType): FormType =>
        prev === FormType.SignIn ? FormType.SignUp : FormType.SignIn,
    );
  }, []);

  const FormComponent: ({ toggleFormType }: FormProps) => React.ReactElement =
    formType === FormType.SignIn ? SignInForm : SignUpForm;

  return (
    <div className={styles.authContentWrap}>
      <FormComponent toggleFormType={toggleFormType} />
    </div>
  );
}
