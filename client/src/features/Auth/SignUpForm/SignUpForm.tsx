import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import { FormProps } from "../shared/shared.interfaces";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import {
  INPUT_ELEMENTS,
  PASSWORD_CONFIRMATION_ERROR,
  PASSWORD_ERROR,
  SIGN_UP_BUTTON_TEXT,
} from "./signUpForm.constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "@/shared/shared.constants";
import Input from "@/components/Input/Input";
import Divider from "@/components/Divider/Divider";
import Button from "@/components/Buttons/Button/Button";
import ActionBar from "./ActionBar/ActionBar";
import SignInWith from "../shared/SignInWith/SignInWith";
import { FormData } from "./SignUpForm.types";
import { FormFieldType } from "./signUpForm.enums";
import IconButton from "@/components/Buttons/IconButton/IconButton";
import OpenEye from "@/assets/icons/open_eye_24x24.svg?react";
import CloseEye from "@/assets/icons/close_eye_24x24.svg?react";
import { registerUser } from "../auth.slice";
import { useAppDispatch } from "@/store/hooks";
import Message from "@/components/Message/Message";
import { validatePassword } from "@/shared/utils/utils";

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
  const [showPasswordError, setShowPasswordError] =
    React.useState<boolean>(false);
  const [showPasswordConfirmationError, setShowPasswordConfirmationError] =
    React.useState<boolean>(false);
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

  const onPasswordBlur: () => void = (): void => {
    setShowPasswordError(
      form.password.length > EMPTY_STRING_LENGTH &&
        !validatePassword(form.password),
    );
    onPasswordConfirmationBlur();
  };

  const onPasswordConfirmationBlur: () => void = (): void => {
    setShowPasswordConfirmationError(
      form.passwordConfirmation.length > EMPTY_STRING_LENGTH &&
        form.passwordConfirmation !== form.password,
    );
  };

  return (
    <form className={sharedAuthStyles.formWrap} onSubmit={onSubmit}>
      <div className={sharedAuthStyles.formContainer}>
        <Logotype className={sharedAuthStyles.formLogotype} />
        <Input
          fullWidth
          autoComplete={"username"}
          placeholder={INPUT_ELEMENTS[FormFieldType.Username].placeholder}
          name={INPUT_ELEMENTS[FormFieldType.Username].inputName}
          value={form.username}
          onChange={onChangeData}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={"new-password"}
          type={showPassword ? "text" : "password"}
          placeholder={INPUT_ELEMENTS[FormFieldType.Password].placeholder}
          name={INPUT_ELEMENTS[FormFieldType.Password].inputName}
          value={form.password}
          onChange={onChangeData}
          inputAdornment={
            <IconButton onClick={onPasswordVisibilityClick}>
              {showPassword ? <CloseEye /> : <OpenEye />}
            </IconButton>
          }
          onBlur={onPasswordBlur}
        />
        {showPasswordError ? (
          <Message variant={"error"}>{PASSWORD_ERROR}</Message>
        ) : (
          <Divider className={sharedAuthStyles.formDivider} flexItem />
        )}
        <Input
          fullWidth
          autoComplete={"new-password"}
          type={showPasswordConfirmation ? "text" : "password"}
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
          onBlur={onPasswordConfirmationBlur}
        />
        {showPasswordConfirmationError ? (
          <Message variant={"error"}>{PASSWORD_CONFIRMATION_ERROR}</Message>
        ) : (
          <Divider className={sharedAuthStyles.formDivider} flexItem />
        )}
        <Input
          fullWidth
          autoComplete={"email"}
          type={"email"}
          placeholder={INPUT_ELEMENTS[FormFieldType.Email].placeholder}
          name={INPUT_ELEMENTS[FormFieldType.Email].inputName}
          value={form.email}
          onChange={onChangeData}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          fullWidth
          variant={"contained"}
          disabled={signUpButtonDisabled}
          type={"submit"}
        >
          {SIGN_UP_BUTTON_TEXT}
        </Button>
        <ActionBar toggleFormType={toggleFormType} />
        <SignInWith />
      </div>
    </form>
  );
}
