import React from "react";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import { INPUT_ELEMENTS, SIGN_UP_BUTTON_TEXT, TITLE_SCREEN } from "./constants";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "@/shared/constants";
import ActionBar from "./ActionBar";
import SignInWith from "@/features/Auth/shared/SignInWith";
import { FormData } from "./types";
import { registerUser } from "@/features/Auth/slice";
import { useAppDispatch } from "@/store/hooks";
import { Input, Divider, Button, Typography } from "@/components";
import PasswordAdornment from "@/features/Auth/shared/PasswordAdornment";

export default function SignUp(): React.ReactElement {
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
          name={INPUT_ELEMENTS.username.name}
          value={form.username}
          onChange={onChangeData}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={"new-password"}
          type={showPassword ? "text" : "password"}
          placeholder={INPUT_ELEMENTS.password.placeholder}
          name={INPUT_ELEMENTS.password.name}
          value={form.password}
          onChange={onChangeData}
          inputAdornment={
            <PasswordAdornment
              isShow={showPassword}
              onClick={onPasswordVisibilityClick}
            />
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={"new-password"}
          type={showPasswordConfirmation ? "text" : "password"}
          placeholder={INPUT_ELEMENTS.passwordConfirmation.placeholder}
          name={INPUT_ELEMENTS.passwordConfirmation.name}
          value={form.passwordConfirmation}
          onChange={onChangeData}
          inputAdornment={
            <PasswordAdornment
              isShow={showPasswordConfirmation}
              onClick={onPasswordConfirmationVisibilityClick}
            />
          }
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Input
          fullWidth
          autoComplete={"email"}
          type={"email"}
          placeholder={INPUT_ELEMENTS.email.placeholder}
          name={INPUT_ELEMENTS.email.name}
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
