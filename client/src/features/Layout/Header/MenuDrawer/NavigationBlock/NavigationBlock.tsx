import React from "react";
import Button from "@/components/Buttons/Button/Button";
import sharedDrawerStyles from "../menuDrawer.module.css";
import { PATTERN_BUTTON_TEXT } from "./navigationBlock.constants";
import GridPlus from "@/assets/icons/grid_plus_64x64.svg?react";

export default function NavigationBlock(): React.ReactElement {
  return (
    <div className={sharedDrawerStyles.blockContainer}>
      <Button
        fullWidth
        variant={"plain"}
        className={sharedDrawerStyles.defaultBlockButton}
        startIcon={{ content: <GridPlus /> }}
      >
        {PATTERN_BUTTON_TEXT}
      </Button>
      <Button
        fullWidth
        variant={"plain"}
        className={sharedDrawerStyles.defaultBlockButton}
        startIcon={{ content: <GridPlus /> }}
      >
        {PATTERN_BUTTON_TEXT}
      </Button>
    </div>
  );
}
