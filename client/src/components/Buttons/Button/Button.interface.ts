/*
--------------ButtonProps Interface--------------
fullWidth   - flag is full parent width
endIcon     - button end icon
startIcon   - button start icon
variant     - variant of button style
*/

import { ButtonHTMLAttributes } from "react";
import { Adornment, ButtonVariant } from "./button.types";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;

  endIcon?: Adornment;
  startIcon?: Adornment;
  variant?: ButtonVariant;
}
