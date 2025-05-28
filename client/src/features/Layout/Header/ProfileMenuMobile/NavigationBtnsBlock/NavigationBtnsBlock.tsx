import React from "react";
import Button from "@/components/Buttons/DefaultButton/Button";
import sharedMenuMobileStyles from "../profileMenuMobile.module.css";
import sharedHeaderStyles from "../../header.module.css";
import Lock from "@/assets/icons/lock_outline_64x64.svg?react";
import { FIRST_PATTERN, SECOND_PATTERN } from "./navigationBtnsBlock.constants";

export default function NavigationBtnsBlock(): React.ReactElement {
  return (
    <div className={sharedMenuMobileStyles.btnsBlockContainer}>
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
    </div>
  );
}
