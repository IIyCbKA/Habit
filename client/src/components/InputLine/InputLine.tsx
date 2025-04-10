import React from "react";
import styles from "./InputLine.module.css";
import { InputLineData } from "./InputLine.interface";
import classNames from "classnames";

export default function InputLine({
  fullWidth,
  placeholder,
  value,
  className,
  onChange,
}: InputLineData): React.ReactElement {
  const inputStyles = classNames(styles.input, className, {
    [styles.fullWidth]: fullWidth,
  });

  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputStyles}
    />
  );
}
