import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import {
  INPUT_ELEMENTS,
  SIGN_UP_BUTTON_TEXT,
  TITLE_SCREEN,
} from "./signUpForm.constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "@/shared/shared.constants";
import Input from "@/components/Input/Input";
import Divider from "@/components/Divider/Divider";
import Button from "@/components/Buttons/Button/Button";
import ActionBar from "./ActionBar/ActionBar";
import SignInWith from "../shared/SignInWith/SignInWith";
import { FormData } from "./SignUpForm.types";
import IconButton from "@/components/Buttons/IconButton/IconButton";
import OpenEye from "@/assets/icons/open_eye_24x24.svg?react";
import CloseEye from "@/assets/icons/close_eye_24x24.svg?react";
import { registerUser } from "../auth.slice";
import { useAppDispatch } from "@/store/hooks";
import Typography from "@/components/Typography/Typography";

export default function SignUpForm(): React.ReactElement {
  const [isProcessing, setProcessing] = React.useState<boolean>(false);
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

  const onSubmit: (e: React.FormEvent) => void = async (
    e: React.FormEvent,
  ): Promise<void> => {
    e.preventDefault();
    setProcessing(true);

    try {
      await dispatch(
        registerUser({
          username: form.username,
          password: form.password,
          email: form.email,
        }),
      ).unwrap();
    } catch (e) {
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className={sharedAuthStyles.formWrap} onSubmit={onSubmit}>
      <div className={sharedAuthStyles.formContainer}>
        <Typography>{TITLE_SCREEN}</Typography>
        <Input
          fullWidth
          autoComplete={"username"}
          placeholder={INPUT_ELEMENTS.username.placeholder}
          name={INPUT_ELEMENTS.username.inputName}
          value={form.username}
          onChange={onChangeData}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={"new-password"}
          type={showPassword ? "text" : "password"}
          placeholder={INPUT_ELEMENTS.password.placeholder}
          name={INPUT_ELEMENTS.password.inputName}
          value={form.password}
          onChange={onChangeData}
          inputAdornment={
            <IconButton
              className={sharedAuthStyles.passwordInput}
              onClick={onPasswordVisibilityClick}
            >
              {showPassword ? <CloseEye /> : <OpenEye />}
            </IconButton>
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={"new-password"}
          type={showPasswordConfirmation ? "text" : "password"}
          placeholder={INPUT_ELEMENTS.passwordConfirmation.placeholder}
          name={INPUT_ELEMENTS.passwordConfirmation.inputName}
          value={form.passwordConfirmation}
          onChange={onChangeData}
          inputAdornment={
            <IconButton
              className={sharedAuthStyles.passwordInput}
              onClick={onPasswordConfirmationVisibilityClick}
            >
              {showPasswordConfirmation ? <CloseEye /> : <OpenEye />}
            </IconButton>
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={"email"}
          type={"email"}
          placeholder={INPUT_ELEMENTS.email.placeholder}
          name={INPUT_ELEMENTS.email.inputName}
          value={form.email}
          onChange={onChangeData}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          isLoading={isProcessing}
          fullWidth
          variant={"contained"}
          disabled={signUpButtonDisabled}
          type={"submit"}
        >
          {SIGN_UP_BUTTON_TEXT}
        </Button>
        <SignInWith />
        <ActionBar />
      </div>
    </form>
  );
}
