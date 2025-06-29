import React from "react";
import UnitedKingdom from "@/assets/icons/united_kingdom_64x64.svg?react";
import styles from "./country.module.css";
import sharedStyles from "@/shared/shared.module.css";
import classNames from "classnames";
import { COUNTRY_TEXT } from "./country.constants";

export default function Country(): React.ReactElement {
  const textStyle = classNames(styles.countryText, sharedStyles.lowerText);

  return (
    <div className={styles.countryWrap}>
      <div className={styles.countryImgWrap}>
        <UnitedKingdom className={styles.countryImg} />
      </div>
      <div className={textStyle}>{COUNTRY_TEXT}</div>
    </div>
  );
}
