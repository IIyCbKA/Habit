import React, { useCallback, useState } from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import { FormProps } from "../shared/shared.interfaces";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import { INPUT_ELEMENTS, SIGN_UP_BUTTON_TEXT } from "./SignUpForm.constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "../shared/shared.constants";
import TextField from "@/components/TextField/TextField";
import Divider from "@/components/Divider/Divider";
import Button from "@/components/Button/Button";
import { ButtonType } from "@/components/Button/Button.enums";
import ActionBar from "./ActionBar/ActionBar";
import SignInWith from "../shared/SignInWith/SignInWith";
import { FormData } from "./SignUpForm.type";
import { AutoCompleteMode } from "@/components/TextField/TextField.enums";
import { FormFieldType } from "./SignUpForm.enums";
import { TextFieldType } from "@/components/TextField/TextField.enums";

export default function SignUpForm({
  toggleFormType,
}: FormProps): React.ReactElement {
  const [form, setForm] = useState<FormData>({
    username: EMPTY_STRING,
    password: EMPTY_STRING,
    passwordConfirmation: EMPTY_STRING,
    email: EMPTY_STRING,
  });

  const signUpButtonDisabled: boolean =
    Object.values(form).some(
      (value: string): boolean => value.length === EMPTY_STRING_LENGTH,
    ) || form.password !== form.passwordConfirmation;

  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void =
    useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setForm((prev: FormData) => ({ ...prev, [name]: value }));
    }, []);

  const handleSignUpClick: () => void = (): void => {};

  return (
    <form className={sharedAuthStyles.formWrap}>
      <div className={sharedAuthStyles.formContainer}>
        <Logotype className={sharedAuthStyles.formLogotype} />
        <TextField
          fullWidth
          placeholder={INPUT_ELEMENTS[FormFieldType.Username].placeholder}
          name={INPUT_ELEMENTS[FormFieldType.Username].inputName}
          value={form.username}
          onChange={handleChange}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <TextField
          fullWidth
          autoComplete={AutoCompleteMode.NewPassword}
          type={TextFieldType.Password}
          placeholder={INPUT_ELEMENTS[FormFieldType.Password].placeholder}
          name={INPUT_ELEMENTS[FormFieldType.Password].inputName}
          value={form.password}
          onChange={handleChange}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <TextField
          fullWidth
          autoComplete={AutoCompleteMode.NewPassword}
          type={TextFieldType.Password}
          placeholder={
            INPUT_ELEMENTS[FormFieldType.PasswordConfirmation].placeholder
          }
          name={INPUT_ELEMENTS[FormFieldType.PasswordConfirmation].inputName}
          value={form.passwordConfirmation}
          onChange={handleChange}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <TextField
          fullWidth
          autoComplete={AutoCompleteMode.Email}
          type={TextFieldType.Email}
          placeholder={INPUT_ELEMENTS[FormFieldType.Email].placeholder}
          name={INPUT_ELEMENTS[FormFieldType.Email].inputName}
          value={form.email}
          onChange={handleChange}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          fullWidth
          variant={ButtonType.Contained}
          disabled={signUpButtonDisabled}
          onClick={handleSignUpClick}
        >
          {SIGN_UP_BUTTON_TEXT}
        </Button>
        <ActionBar toggleFormType={toggleFormType} />
        <SignInWith />
      </div>
    </form>
  );
}
