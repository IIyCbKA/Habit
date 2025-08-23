import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import Input from "@/components/Input/Input";
import Divider from "@/components/Divider/Divider";
import Button from "@/components/Buttons/Button/Button";
import { EMPTY_STRING, EMPTY_STRING_LENGTH } from "@/shared/shared.constants";
import {
  RECOVER_PASSWORD_BTN_TEXT,
  EMAIL_PLACEHOLDER,
  TITLE_SCREEN,
} from "./forgotPassword.constants";
import ActionBar from "./ActionBar/ActionBar";
import { useAppDispatch } from "@/store/hooks";
import { resetPassword } from "@/features/Auth/auth.slice";
import Typography from "@/components/Typography/Typography";

export default function ForgotPasswordForm(): React.ReactElement {
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
      await dispatch(resetPassword({ email })).unwrap();
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
