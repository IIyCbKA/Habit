import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectUsername } from "@/features/Auth/auth.slice";
import sharedDrawerStyles from "../menuDrawer.module.css";
import DefaultAvatar from "@/assets/icons/default_avatar_64x64.svg?react";
import Button from "@/components/Buttons/Button/Button";

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
