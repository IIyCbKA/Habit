import React from "react";
import sharedHeaderStyles from "../../header.module.css";
import {
  FIRST_PATTERN,
  SECOND_PATTERN,
  SIGN_OUT_BTN,
} from "./btnsBlock.constants";
import Button from "@/components/Buttons/DefaultButton/Button";
import { logout } from "@/features/Auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import Logout from "@/assets/icons/logout_64x64.svg?react";
import Lock from "@/assets/icons/lock_outline_64x64.svg?react";

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
        adornment={<Lock />}
      >
        {FIRST_PATTERN}
      </Button>
      <Button
        fullWidth
        className={sharedHeaderStyles.defaultMenuBtn}
        adornment={<Lock />}
      >
        {SECOND_PATTERN}
      </Button>
      <Button
        fullWidth
        className={sharedHeaderStyles.defaultMenuBtn}
        onClick={onSignOut}
        adornment={<Logout />}
      >
        {SIGN_OUT_BTN}
      </Button>
    </>
  );
}
