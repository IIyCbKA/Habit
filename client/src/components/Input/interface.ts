/*
--------------InputProps Interface--------------
error          - flag indicating whether the input is in an error state
fullWidth      - flag to stretch the input to fill the parent's width
helperText     - text displayed under the input for guidance or error messages
inputAdornment - icon for end of input field
*/

import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  onlyDisabled?: boolean;

  inputAdornment?: React.ReactNode;
}
