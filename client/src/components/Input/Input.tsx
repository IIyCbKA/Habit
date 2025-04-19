import React from "react";
import styles from "./Input.module.css";
import { InputProps } from "./Input.interface";
import classNames from "classnames";
import { InputType, AutoCompleteMode } from "./Input.enums";

export default function Input({
  fullWidth,
  name,
  placeholder,
  value,
  autoComplete = AutoCompleteMode.Off,
  className,
  inputAdornment,
  onChange,
  type = InputType.Text,
}: InputProps): React.ReactElement {
  const inputWrapperStyles = classNames(styles.inputWrapper, {
    [styles.fullWidth]: fullWidth,
  });

  const inputStyles = classNames(styles.input, className, {
    [styles.inputWithAdornmentEnd]: inputAdornment,
  });

  return (
    <span className={inputWrapperStyles}>
      <input
        autoComplete={autoComplete}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputStyles}
      />
      {inputAdornment && (
        <div className={styles.adornmentWrap}>{inputAdornment}</div>
      )}
    </span>
  );
}
