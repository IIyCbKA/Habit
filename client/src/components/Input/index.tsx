import React from "react";
import styles from "./styles.module.css";
import { InputProps } from "./interface";
import classNames from "classnames";

function InputInner(
  { fullWidth, className, inputAdornment, ...other }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
): React.ReactElement {
  const inputWrapperStyles = classNames(styles.inputWrapper, {
    [styles.fullWidth]: fullWidth,
  });

  const inputStyles = classNames(styles.input, className, {
    [styles.inputWithAdornmentEnd]: inputAdornment,
  });

  return (
    <span className={inputWrapperStyles}>
      <input ref={ref} {...other} className={inputStyles} />
      {inputAdornment && (
        <div className={styles.adornmentWrap}>{inputAdornment}</div>
      )}
    </span>
  );
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(InputInner);

export default Input;
