import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import Input from "@/components/Input/Input";
import { EMPTY_STRING } from "@/shared/shared.constants";
import {
  CODE_LENGTH,
  CODE_PLACEHOLDER,
  CONFIRM_BTN_TEXT,
} from "./confirmEmailForm.constants";
import Button from "@/components/Buttons/Button/Button";
import { useAppDispatch } from "@/store/hooks";
import { emailConfirm } from "../auth.slice";
import Divider from "@/components/Divider/Divider";
import ActionBar from "./ActionBar/ActionBar";

export default function ConfirmEmailForm(): React.ReactElement {
  const [code, setCode] = React.useState<string>(EMPTY_STRING);
  const [isProcessing, setProcessing] = React.useState<boolean>(false);
  const confirmBtnDisable = code.length !== CODE_LENGTH;
  const dispatch = useAppDispatch();

  const onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setCode(e.target.value);
  };

  const onSubmit: (e: React.FormEvent) => void = async (
    e: React.FormEvent,
  ): Promise<void> => {
    e.preventDefault();
    setProcessing(true);

    try {
      await dispatch(emailConfirm({ code })).unwrap();
    } catch (e) {
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className={sharedAuthStyles.formWrap} onSubmit={onSubmit}>
      <div className={sharedAuthStyles.formContainer}>
        <Logotype className={sharedAuthStyles.formLogotype} />
        <Input
          fullWidth
          autoComplete={"one-time-code"}
          inputMode={"numeric"}
          value={code}
          onChange={onCodeChange}
          placeholder={CODE_PLACEHOLDER}
          maxLength={CODE_LENGTH}
        />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          isLoading={isProcessing}
          fullWidth
          variant={"contained"}
          type={"submit"}
          disabled={confirmBtnDisable}
        >
          {CONFIRM_BTN_TEXT}
        </Button>
        <ActionBar />
      </div>
    </form>
  );
}
