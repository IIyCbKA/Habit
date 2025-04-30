import React from "react";
import styles from "./message.module.css";
import sharedStyles from "@/shared/shared.module.css";
import { MessageProps } from "./Message.interface";
import classNames from "classnames";
import { MessageVariant } from "./message.enums";

export default function Message({
  variant,
  className,
  ...other
}: MessageProps): React.ReactElement {
  const messageStyles = classNames(
    styles.messageRoot,
    sharedStyles.lowerText,
    className,
    {
      [styles.successVariant]: variant === MessageVariant.Success,
      [styles.errorVariant]: variant === MessageVariant.Error,
      [styles.warningVariant]: variant === MessageVariant.Warning,
    },
  );

  return <div {...other} className={messageStyles} />;
}
