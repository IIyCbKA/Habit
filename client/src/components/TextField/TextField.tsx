import React from "react";
import styles from "./TextField.module.css";
import { TextFieldProps } from "./TextField.interface";
import classNames from "classnames";
import { TextFieldType, AutoCompleteMode } from "./TextField.enums";

export default function TextField({
  autoComplete = AutoCompleteMode.Off,
  fullWidth,
  name,
  placeholder,
  type = TextFieldType.Text,
  value,
  className,
  onChange,
}: TextFieldProps): React.ReactElement {
  const inputStyles = classNames(styles.input, className, {
    [styles.fullWidth]: fullWidth,
  });

  return (
    <input
      autoComplete={autoComplete}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputStyles}
    />
  );
}
