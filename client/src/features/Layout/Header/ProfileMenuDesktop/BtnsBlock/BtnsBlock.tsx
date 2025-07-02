import React from "react";
import sharedHeaderStyles from "../../header.module.css";
import {
  FIRST_PATTERN,
  SECOND_PATTERN,
  SETTINGS_BTN,
  SIGN_OUT_BTN,
} from "./btnsBlock.constants";
import Button from "@/components/Buttons/Button/Button";
import { logout } from "@/features/Auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import Logout from "@/assets/icons/logout_64x64.svg?react";
import Closed from "@/assets/icons/close_64x64.svg?react";
import Settings from "@/assets/icons/settings_64x64.svg?react";

export default function BtnsBlock(): React.ReactElement {
  const dispatch = useAppDispatch();

  const onSignOut: () => void = (): void => {
    dispatch(logout());
  };

  return (
    <>
      <Button
        fullWidth
        className={sharedHeaderStyles.defaultMenuBtn}
        startIcon={{ content: <Closed /> }}
      >
        {FIRST_PATTERN}
      </Button>
      <Button
        fullWidth
        className={sharedHeaderStyles.defaultMenuBtn}
        startIcon={{ content: <Closed /> }}
      >
        {SECOND_PATTERN}
      </Button>
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
        onClick={onSignOut}
        startIcon={{ content: <Logout /> }}
      >
        {SIGN_OUT_BTN}
      </Button>
    </>
  );
}
