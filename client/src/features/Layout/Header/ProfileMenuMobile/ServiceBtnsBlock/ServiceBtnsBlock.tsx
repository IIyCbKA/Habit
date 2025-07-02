import React from "react";
import Button from "@/components/Buttons/Button/Button";
import sharedMenuMobileStyles from "../profileMenuMobile.module.css";
import sharedHeaderStyles from "../../header.module.css";
import { SETTINGS_BTN, SIGN_OUT_BTN } from "./serviceBtnsBlock.constants";
import Logout from "@/assets/icons/logout_64x64.svg?react";
import Settings from "@/assets/icons/settings_64x64.svg?react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/Auth/auth.slice";

export default function ServiceBtnsBlock(): React.ReactElement {
  const dispatch = useAppDispatch();

  const onSignOut: () => void = (): void => {
    dispatch(logout());
  };

  return (
    <div className={sharedMenuMobileStyles.btnsBlockContainer}>
      <Button
        fullWidth
        className={sharedHeaderStyles.defaultMenuBtn}
        startIcon={{ content: <Settings /> }}
      >
        {SETTINGS_BTN}
      </Button>
      <Button
        fullWidth
        className={sharedHeaderStyles.defaultMenuBtn}
        startIcon={{ content: <Logout /> }}
        onClick={onSignOut}
      >
        {SIGN_OUT_BTN}
      </Button>
    </div>
  );
}
