import React from "react";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import { EMPTY_STRING } from "@/shared/constants";
import {
  RECOVER_PASSWORD_BTN_TEXT,
  EMAIL_PLACEHOLDER,
  TITLE_SCREEN,
} from "./constants";
import ActionBar from "./ActionBar";
import { useAppDispatch } from "@/store/hooks";
import { passwordResetRequest } from "@/features/Auth/slice";
import { Button, Divider, Input, Typography } from "@/components";
import { validateEmail } from "@/features/Auth/validators";

export default function ForgotPassword(): React.ReactElement {
  const dispatch = useAppDispatch();
  const [email, setEmail] = React.useState<string>(EMPTY_STRING);
  const [isProcessing, setProcessing] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const emailRef = React.useRef<HTMLInputElement | null>(null);

  const onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setEmail(e.target.value);
    if (error) setError(undefined);
  };

  const onSubmit: (e: React.FormEvent) => void = async (
    e: React.FormEvent,
  ): Promise<void> => {
    e.preventDefault();

    const newError: string | undefined = validateEmail(email);

    setError(newError);

    if (newError) {
      emailRef.current?.focus();
      return;
    }

    setProcessing(true);
    try {
      await dispatch(passwordResetRequest({ email })).unwrap();
    } catch (e) {
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className={sharedAuthStyles.formWrap} onSubmit={onSubmit} noValidate>
      <div className={sharedAuthStyles.formContainer}>
        <Typography>{TITLE_SCREEN}</Typography>
        <Input
          fullWidth
          ref={emailRef}
          name={"email"}
          autoComplete={"email"}
          value={email}
          onChange={onEmailChange}
          placeholder={EMAIL_PLACEHOLDER}
          error={Boolean(error)}
          helperText={error}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          isLoading={isProcessing}
          fullWidth
          variant={"contained"}
          type={"submit"}
        >
          {RECOVER_PASSWORD_BTN_TEXT}
        </Button>
        <ActionBar />
      </div>
    </form>
  );
}
