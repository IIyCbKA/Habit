import React from "react";
import Button from "@/components/Buttons/Button/Button";
import sharedMenuMobileStyles from "../profileMenuMobile.module.css";
import sharedHeaderStyles from "../../header.module.css";
import Closed from "@/assets/icons/close_64x64.svg?react";
import { FIRST_PATTERN, SECOND_PATTERN } from "./navigationBtnsBlock.constants";

export default function NavigationBtnsBlock(): React.ReactElement {
  return (
    <div className={sharedMenuMobileStyles.btnsBlockContainer}>
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
    </div>
  );
}
