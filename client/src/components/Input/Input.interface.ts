/*
--------------InputProps Interface--------------
fullWidth      - flag is full parent width
name           - name of input field
placeholder    - your placeholder
value          - value of input field
autoComplete   - help type for browser autocomplete
className      - other styles
inputAdornment - icon for end of input field
onChange       - callback for changing current value
type           - type of input field
*/

import React from "react";
import { AutoCompleteMode, InputType } from "./input.enums";

export interface InputProps {
  fullWidth?: boolean;
  name?: string;
  placeholder?: string;
  value?: string;

  autoComplete?: AutoCompleteMode;
  className?: string;
  inputAdornment?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: InputType;
}
