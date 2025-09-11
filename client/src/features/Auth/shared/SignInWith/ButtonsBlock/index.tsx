import React from "react";
import styles from "./styles.module.css";
import { IconButton } from "@/components";
import { ELEMENTS_LIST } from "./constants";
import { ButtonElement } from "./types";
import { API_BASE } from "@/shared/constants";
import { Provider } from "./types";

export default function ButtonsBlock(): React.ReactElement {
  const getOauthStartPath = (provider: Provider, next: string) => {
    return `${API_BASE}/auth/oauth/${provider}/start/?flow=login&next=${next}`;
  };

  return (
    <div className={styles.buttonsBlockContainer}>
      {ELEMENTS_LIST.map(
        (
          { icon: Icon, provider, ...other }: ButtonElement,
          index: number,
        ): React.ReactElement => {
          const onClick = () => {
            const next = encodeURIComponent(window.location.href);
            window.location.href = getOauthStartPath(provider, next);
          };

          return (
            <IconButton
              key={index}
              className={styles.buttonContainer}
              onClick={onClick}
              {...other}
            >
              <Icon />
            </IconButton>
          );
        },
      )}
    </div>
  );
}
