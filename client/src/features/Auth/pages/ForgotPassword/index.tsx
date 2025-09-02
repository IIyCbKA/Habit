import React from "react";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "@/shared/constants";
import {
  RECOVER_PASSWORD_BTN_TEXT,
  EMAIL_PLACEHOLDER,
  TITLE_SCREEN,
} from "./constants";
import ActionBar from "./ActionBar";
import { useAppDispatch } from "@/store/hooks";
import { passwordResetRequest } from "@/features/Auth/slice";
import { Button, Divider, Input, Typography } from "@/components";

export default function ForgotPassword(): React.ReactElement {
  const dispatch = useAppDispatch();
  const [email, setEmail] = React.useState<string>(EMPTY_STRING);
  const [isProcessing, setProcessing] = React.useState<boolean>(false);
  const continueDisabled = email.length === EMPTY_STRING_LENGTH;

  const onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setEmail(e.target.value);
  };

  const onSubmit: (e: React.FormEvent) => void = async (
    e: React.FormEvent,
  ): Promise<void> => {
    e.preventDefault();
    setProcessing(true);
    try {
      await dispatch(passwordResetRequest({ email })).unwrap();
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
          name={"email"}
          autoComplete={"email"}
          value={email}
          onChange={onEmailChange}
          placeholder={EMAIL_PLACEHOLDER}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          isLoading={isProcessing}
          fullWidth
          variant={"contained"}
          type={"submit"}
          disabled={continueDisabled}
        >
          {RECOVER_PASSWORD_BTN_TEXT}
        </Button>
        <ActionBar />
      </div>
    </form>
  );
}
