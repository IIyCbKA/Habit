import React from "react";
import Button from "@/components/Buttons/Button/Button";
import sharedDrawerStyles from "../menuDrawer.module.css";
import {
  SETTINGS_BUTTON_TEXT,
  SIGN_OUT_BUTTON_TEXT,
} from "./serviceBlock.constants";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/Auth/auth.slice";
import Settings from "@/assets/icons/settings_64x64.svg?react";
import Logout from "@/assets/icons/logout_64x64.svg?react";

export default function ServiceBlock(): React.ReactElement {
  const dispatch = useAppDispatch();

  const onSignOut: () => void = (): void => {
    dispatch(logout());
  };

  return (
    <div className={sharedDrawerStyles.blockContainer}>
      <Button
        fullWidth
        variant={"plain"}
        className={sharedDrawerStyles.defaultBlockButton}
        startIcon={{ content: <Settings /> }}
      >
        {SETTINGS_BUTTON_TEXT}
      </Button>
      <Button
        fullWidth
        variant={"plain"}
        className={sharedDrawerStyles.defaultBlockButton}
        startIcon={{ content: <Logout /> }}
        onClick={onSignOut}
      >
        {SIGN_OUT_BUTTON_TEXT}
      </Button>
    </div>
  );
}
