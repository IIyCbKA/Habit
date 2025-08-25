import React from "react";
import sharedStyles from "../../shared/shared.module.css";
import { FORGOT_PASSWORD_TEXT, SIGN_UP_TEXT } from "./actionBar.constants";
import Button from "@/components/Buttons/Button/Button";
import { useAppDispatch } from "@/store/hooks";
import { setAuthScreen } from "@/features/uiState/uiState.slice";
import { AuthScreen } from "@/features/uiState/uiState.types";

export default function ActionBar(): React.ReactElement {
  const dispatch = useAppDispatch();

  const onAuthChange = React.useCallback(
    (formType: AuthScreen): (() => void) =>
      (): void => {
        dispatch(setAuthScreen(formType));
      },
    [dispatch],
  );

  return (
    <div className={sharedStyles.actionBarContainer}>
      <Button variant={"plain"} onClick={onAuthChange("forgotPassword")}>
        {FORGOT_PASSWORD_TEXT}
      </Button>
      <Button variant={"plain"} onClick={onAuthChange("signUp")}>
        {SIGN_UP_TEXT}
      </Button>
    </div>
  );
}
