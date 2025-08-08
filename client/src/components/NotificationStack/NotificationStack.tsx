import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectNotifications } from "@/features/uiState/uiState.slice";
import { createPortal } from "react-dom";
import styles from "./notificationStack.module.css";
import Notification from "@/components/Notification/Notification";
import { NotificationStackProps } from "./NotificationStack.interface";

function NotificationStack({
  vertical = "bottom",
  horizontal = "right",
  slideFrom = "right",
}: NotificationStackProps): React.ReactElement {
  const list = useAppSelector(selectNotifications);
  const container = document.getElementById("notifications")!;

  return createPortal(
    <div
      data-vertical={vertical}
      data-horizontal={horizontal}
      className={styles.stackRoot}
    >
      {list.map(
        (n): React.ReactElement => (
          <Notification
            key={n.id}
            id={n.id}
            message={n.message}
            autoHideDuration={n.autoHideDuration}
            slideFrom={slideFrom}
          />
        ),
      )}
    </div>,
    container,
  );
}

export default NotificationStack;
