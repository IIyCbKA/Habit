import React from "react";
import sharedAuthStyles from "@/features/Auth/shared/styles.module.css";
import { Button } from "@/components";
import {
  CANCEL_BTN_TEXT,
  RESEND_AFTER_TEXT,
  RESEND_CODE_BTN_TEXT,
  RESEND_LOCK_SECONDS,
} from "./constants";
import { resendCode } from "@/features/Auth/api";
import { seconds2MinutesSeconds } from "@/shared/utils";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/Auth/slice";

export default function ActionBar(): React.ReactElement {
  const [secondsLeft, setSecondsLeft] =
    React.useState<number>(RESEND_LOCK_SECONDS);
  const [isProcessing, setProcessing] = React.useState<boolean>(false);
  const isDisabledResend: boolean = secondsLeft > 0;
  const dispatch = useAppDispatch();

  const onResendClick: () => Promise<void> = async (): Promise<void> => {
    setProcessing(true);

    try {
      await resendCode();
    } catch (e) {
    } finally {
      setProcessing(false);
    }

    setSecondsLeft(RESEND_LOCK_SECONDS);
  };

  const onCancelClick: () => void = (): void => {
    dispatch(logout());
  };

  React.useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setTimeout((): void => {
      setSecondsLeft((prev: number): number => prev - 1);
    }, 1000);

    return (): void => clearTimeout(timer);
  }, [secondsLeft]);

  const resendBtnText: string =
    secondsLeft > 0
      ? `${RESEND_AFTER_TEXT} ${seconds2MinutesSeconds(secondsLeft)}`
      : RESEND_CODE_BTN_TEXT;

  return (
    <div className={sharedAuthStyles.actionBarContainer}>
      <Button variant={"plain"} onClick={onCancelClick}>
        {CANCEL_BTN_TEXT}
      </Button>
      <Button
        isLoading={isProcessing}
        disabled={isDisabledResend}
        variant={"plain"}
        onClick={onResendClick}
      >
        {resendBtnText}
      </Button>
    </div>
  );
}
