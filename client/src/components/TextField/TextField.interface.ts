/*
--------------TextFieldProps Interface--------------
fullWidth   - flag is full parent width
name        - name of input field
placeholder - your placeholder
type        - type of input field
value       - value of input field
className   - other styles
onChange    - callback for changing current value
*/

import React from "react";
import { AutoCompleteMode, TextFieldType } from "./TextField.enums";

export interface TextFieldProps {
  autoComplete?: AutoCompleteMode;
  fullWidth?: boolean;
  name?: string;
  placeholder?: string;
  type?: TextFieldType;
  value?: string;

  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
