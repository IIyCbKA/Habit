import React from "react";
import { Button } from "@/components";
import sharedDrawerStyles from "@/features/Layout/Header/MenuDrawer/styles.module.css";
import { PATTERN_BUTTON_TEXT } from "./constants";
import { Grid } from "@/assets/icons";

export default function NavigationBlock(): React.ReactElement {
  return (
    <div className={sharedDrawerStyles.blockContainer}>
      <Button
        fullWidth
        variant={"plain"}
        className={sharedDrawerStyles.defaultBlockButton}
        startIcon={{ content: <Grid /> }}
      >
        {PATTERN_BUTTON_TEXT}
      </Button>
      <Button
        fullWidth
        variant={"plain"}
        className={sharedDrawerStyles.defaultBlockButton}
        startIcon={{ content: <Grid /> }}
      >
        {PATTERN_BUTTON_TEXT}
      </Button>
    </div>
  );
}
