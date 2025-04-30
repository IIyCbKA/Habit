/*
--------------ButtonProps Interface--------------
fullWidth   - flag is full parent width
className   - other styles
variant     - variant of button style
*/

import { ButtonHTMLAttributes } from "react";
import { ButtonVariant } from "./button.enums";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;

  className?: string;
  variant?: ButtonVariant;
}
