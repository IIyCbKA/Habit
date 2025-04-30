/*
--------------InputProps Interface--------------
fullWidth      - flag is full parent width
className      - other styles
inputAdornment - icon for end of input field
*/

import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;

  className?: string;
  inputAdornment?: React.ReactNode;
}
