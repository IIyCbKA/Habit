import React from "react";
import sharedAuthStyles from "../shared/shared.module.css";
import { FormData } from "../shared/shared.interface";
import Logotype from "@/assets/icons/heart_with_text_148x180.svg?react";
import {
  FIRST_LINE_PLACEHOLDER,
  SECOND_LINE_PLACEHOLDER,
  THIRD_LINE_PLACEHOLDER,
  FOURTH_LINE_PLACEHOLDER,
  SIGN_UP_BUTTON_TEXT,
} from "./SignUpForm.constants";
import InputLine from "@/components/InputLine/InputLine";
import Divider from "@/components/Divider/Divider";
import Button from "@/components/Button/Button";
import { ButtonType } from "@/components/Button/Button.enums";
import ActionBar from "./ActionBar/ActionBar";

export default function SignUpForm({
  onClickChangeForm,
}: FormData): React.ReactElement {
  const handleSignUpClick: () => void = (): void => {};

  return (
    <div className={sharedAuthStyles.formWrap}>
      <div className={sharedAuthStyles.formContainer}>
        <Logotype className={sharedAuthStyles.formLogotype} />
        <InputLine fullWidth placeholder={FIRST_LINE_PLACEHOLDER} />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <InputLine fullWidth placeholder={SECOND_LINE_PLACEHOLDER} />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <InputLine fullWidth placeholder={THIRD_LINE_PLACEHOLDER} />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <InputLine fullWidth placeholder={FOURTH_LINE_PLACEHOLDER} />
        <Divider className={sharedAuthStyles.formDivider} flexItem />
        <Button
          fullWidth
          variant={ButtonType.Contained}
          onClick={handleSignUpClick}
        >
          {SIGN_UP_BUTTON_TEXT}
        </Button>
        <ActionBar />
      </div>
    </div>
  );
}
