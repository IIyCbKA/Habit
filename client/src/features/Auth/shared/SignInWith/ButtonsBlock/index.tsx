import React from "react";
import styles from "./styles.module.css";
import { IconButton } from "@/components";
import { ELEMENTS_LIST } from "./constants";
import { ButtonElement } from "./types";
import classNames from "classnames";

export default function ButtonsBlock(): React.ReactElement {
  return (
    <div className={styles.buttonsBlockContainer}>
      {ELEMENTS_LIST.map(
        (item: ButtonElement, index: number): React.ReactElement => {
          const buttonStyles = classNames(
            styles.buttonContainer,
            item.className,
          );

          return (
            <IconButton key={index} className={buttonStyles}>
              <item.icon />
            </IconButton>
          );
        },
      )}
    </div>
  );
}
