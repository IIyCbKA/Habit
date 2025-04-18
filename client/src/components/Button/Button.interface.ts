/*
--------------ButtonProps Interface--------------
children    - text in button
disabled    - flag is button is disabled
fullWidth   - flag is full parent width
variant     - variant of button style
className   - other styles
onClick     - callback for click to button
*/

import React from "react";
import { ButtonType } from "./Button.enums";

export interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: ButtonType;

  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
