import React from "react";
import styles from "./message.module.css";
import sharedStyles from "@/shared/shared.module.css";
import { MessageProps } from "./Message.interface";
import classNames from "classnames";

function MessageInner(
  { variant, className, ...other }: MessageProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const messageStyles = classNames(
    styles.messageRoot,
    sharedStyles.lowerText,
    className,
    {
      [styles.successVariant]: variant === "success",
      [styles.errorVariant]: variant === "error",
      [styles.warningVariant]: variant === "warning",
    },
  );

  return <div ref={ref} {...other} className={messageStyles} />;
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(MessageInner);

export default Message;
