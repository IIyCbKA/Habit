import React from "react";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import { EMPTY_STRING } from "@/shared/constants";
import {
  CODE_PLACEHOLDER,
  CONFIRM_BUTTON_TEXT,
  TITLE_SCREEN,
} from "./constants";
import { useAppDispatch } from "@/store/hooks";
import { emailConfirm } from "@/features/Auth/slice";
import ActionBar from "./ActionBar";
import { Input, Button, Divider, Typography } from "@/components";
import { validateNonEmpty } from "@/features/Auth/validators";

export default function ConfirmEmail(): React.ReactElement {
  const [code, setCode] = React.useState<string>(EMPTY_STRING);
  const [isProcessing, setProcessing] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const codeRef = React.useRef<HTMLInputElement | null>(null);

  const onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setCode(e.target.value);
    if (error) setError(undefined);
  };

  const onSubmit: (e: React.FormEvent) => void = async (
    e: React.FormEvent,
  ): Promise<void> => {
    e.preventDefault();

    const newError: string | undefined = validateNonEmpty(code);

    setError(newError);

    if (newError) {
      codeRef.current?.focus();
      return;
    }

    setProcessing(true);
    try {
      await dispatch(emailConfirm({ code })).unwrap();
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
          ref={codeRef}
          name={"code"}
          autoComplete={"one-time-code"}
          inputMode={"numeric"}
          value={code}
          onChange={onCodeChange}
          placeholder={CODE_PLACEHOLDER}
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
          {CONFIRM_BUTTON_TEXT}
        </Button>
        <ActionBar />
      </div>
    </form>
  );
}
