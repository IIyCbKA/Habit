import React from "react";
import { Button } from "@/components";
import sharedDrawerStyles from "@/features/Layouts/AuthVerifiedLayout/Header/MenuDrawer/styles.module.css";
import { SETTINGS_BUTTON_TEXT, SIGN_OUT_BUTTON_TEXT } from "./constants";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/Auth/slice";
import { Logout, Settings } from "@/assets/icons";

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
