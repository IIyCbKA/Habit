import React from "react";
import styles from "./styles.module.css";
import { InputProps } from "./interface";
import { HelperProps } from "./types";
import classNames from "classnames";

function Helper({
  text,
  error,
  className,
  ...other
}: HelperProps): React.ReactElement | null {
  const helperStyles = classNames(styles.helper, className, {
    [styles.error]: error,
  });

  if (!text) return null;

  return (
    <div {...other} className={helperStyles}>
      {text}
    </div>
  );
}

function InputInner(
  {
    error,
    fullWidth,
    helperText,
    className,
    inputAdornment,
    id,
    name,
    ...other
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
): React.ReactElement {
  const inputWrapperStyles = classNames(styles.inputWrapper, {
    [styles.fullWidth]: fullWidth,
    [styles.error]: error,
  });

  const inputStyles = classNames(styles.input, className, {
    [styles.inputWithAdornmentEnd]: inputAdornment,
  });

  const helperId = helperText ? `${id ?? name}-helper` : undefined;

  return (
    <>
      <span className={inputWrapperStyles}>
        <input
          ref={ref}
          {...other}
          id={id ?? name}
          name={name}
          className={inputStyles}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={helperId}
        />
        {inputAdornment && (
          <div className={styles.adornmentWrap}>{inputAdornment}</div>
        )}
      </span>
      <Helper id={helperId} text={helperText} error={error} />
    </>
  );
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(InputInner);

export default Input;
