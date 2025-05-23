/*
--------------ButtonProps Interface--------------
fullWidth   - flag is full parent width
adornment   - icon for start of btn
variant     - variant of button style
*/

import React, { ButtonHTMLAttributes } from "react";
import { ButtonVariant } from "./button.enums";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;

  adornment?: React.ReactNode;
  variant?: ButtonVariant;
}
