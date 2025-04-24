import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import { FormProps } from "../shared/shared.interfaces";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import { INPUT_ELEMENTS, SIGN_UP_BUTTON_TEXT } from "./signUpForm.constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "../shared/shared.constants";
import Input from "@/components/Input/Input";
import Divider from "@/components/Divider/Divider";
import Button from "@/components/Buttons/DefaultButton/Button";
import { ButtonVariant } from "@/components/Buttons/DefaultButton/button.enums";
import ActionBar from "./ActionBar/ActionBar";
import SignInWith from "../shared/SignInWith/SignInWith";
import { FormData } from "./SignUpForm.types";
import { AutoCompleteMode, InputType } from "@/components/Input/input.enums";
import { FormFieldType } from "./signUpForm.enums";
import { ButtonType } from "@/components/Buttons/shared.enums";
import IconButton from "@/components/Buttons/IconButton/IconButton";
import OpenEye from "@/assets/icons/open_eye_24x24.svg?react";
import CloseEye from "@/assets/icons/close_eye_24x24.svg?react";
import { registerUser } from "@/features/Auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";

export default function SignUpForm({
  toggleFormType,
}: FormProps): React.ReactElement {
  const [form, setForm] = React.useState<FormData>({
    username: EMPTY_STRING,
    password: EMPTY_STRING,
    passwordConfirmation: EMPTY_STRING,
    email: EMPTY_STRING,
  });

  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    React.useState<boolean>(false);

  const onPasswordVisibilityClick: () => void = (): void => {
    setShowPassword((prev: boolean): boolean => !prev);
  };

  const onPasswordConfirmationVisibilityClick: () => void = (): void => {
    setShowPasswordConfirmation((prev: boolean): boolean => !prev);
  };

  const signUpButtonDisabled: boolean =
    Object.values(form).some(
      (value: string): boolean => value.length === EMPTY_STRING_LENGTH,
    ) || form.password !== form.passwordConfirmation;

  const onChangeData: (e: React.ChangeEvent<HTMLInputElement>) => void =
    React.useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setForm((prev: FormData) => ({ ...prev, [name]: value }));
    }, []);

  const onSubmit: (e: React.FormEvent) => void = (e: React.FormEvent): void => {
    e.preventDefault();
    dispatch(
      registerUser({
        username: form.username,
        password: form.password,
        email: form.email,
      }),
    );
  };

  return (
    <form className={sharedAuthStyles.formWrap} onSubmit={onSubmit}>
      <div className={sharedAuthStyles.formContainer}>
        <Logotype className={sharedAuthStyles.formLogotype} />
        <Input
          fullWidth
          placeholder={INPUT_ELEMENTS[FormFieldType.Username].placeholder}
          name={INPUT_ELEMENTS[FormFieldType.Username].inputName}
          value={form.username}
          onChange={onChangeData}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={AutoCompleteMode.NewPassword}
          type={showPassword ? InputType.Text : InputType.Password}
          placeholder={INPUT_ELEMENTS[FormFieldType.Password].placeholder}
          name={INPUT_ELEMENTS[FormFieldType.Password].inputName}
          value={form.password}
          onChange={onChangeData}
          inputAdornment={
            <IconButton onClick={onPasswordVisibilityClick}>
              {showPassword ? <CloseEye /> : <OpenEye />}
            </IconButton>
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={AutoCompleteMode.NewPassword}
          type={showPasswordConfirmation ? InputType.Text : InputType.Password}
          placeholder={
            INPUT_ELEMENTS[FormFieldType.PasswordConfirmation].placeholder
          }
          name={INPUT_ELEMENTS[FormFieldType.PasswordConfirmation].inputName}
          value={form.passwordConfirmation}
          onChange={onChangeData}
          inputAdornment={
            <IconButton onClick={onPasswordConfirmationVisibilityClick}>
              {showPasswordConfirmation ? <CloseEye /> : <OpenEye />}
            </IconButton>
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={AutoCompleteMode.Email}
          type={InputType.Email}
          placeholder={INPUT_ELEMENTS[FormFieldType.Email].placeholder}
          name={INPUT_ELEMENTS[FormFieldType.Email].inputName}
          value={form.email}
          onChange={onChangeData}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          fullWidth
          variant={ButtonVariant.Contained}
          disabled={signUpButtonDisabled}
          type={ButtonType.Submit}
        >
          {SIGN_UP_BUTTON_TEXT}
        </Button>
        <ActionBar toggleFormType={toggleFormType} />
        <SignInWith />
      </div>
    </form>
  );
}
