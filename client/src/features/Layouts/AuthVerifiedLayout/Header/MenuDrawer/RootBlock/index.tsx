import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectUsername } from "@/features/Auth/slice";
import sharedDrawerStyles from "@/features/Layouts/AuthVerifiedLayout/Header/MenuDrawer/styles.module.css";
import { DefaultAvatar } from "@/assets/icons";
import { Button } from "@/components";

export default function RootBlock(): React.ReactElement {
  const username = useAppSelector(selectUsername);

  return (
    <div className={sharedDrawerStyles.blockContainer}>
      <Button
        variant={"plain"}
        className={sharedDrawerStyles.defaultBlockButton}
        startIcon={{ content: <DefaultAvatar /> }}
      >
        {username}
      </Button>
    </div>
  );
}
