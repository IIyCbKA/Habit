import React from "react";
import styles from "./ButtonsBlock.module.css";
import IconButton from "@/components/IconButton/IconButton";
import { ELEMENTS_LIST } from "./ButtonsBlock.constants";
import { ButtonElement } from "./ButtonsBlock.types";
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
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
              >
                <item.icon />
              </a>
            </IconButton>
          );
        },
      )}
    </div>
  );
}
