/*
--------------ButtonProps Interface--------------
disabled    - flag is button is disabled
fullWidth   - flag is full parent width
children    - text in button
className   - other styles
onClick     - callback for click to button
type        - html-type of button
variant     - variant of button style
*/

import React from "react";
import { ButtonVariant } from "./button.enums";
import { ButtonType } from "../shared.enums";

export interface ButtonProps {
  disabled?: boolean;
  fullWidth?: boolean;

  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonType;
  variant?: ButtonVariant;
}
