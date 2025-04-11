/*
--------------ButtonData Interface--------------
children    - text in button
disabled    - flag is button is disabled
fullWidth   - flag is full parent width
variant     - variant of button style
className   - other styles
onClick     - callback for click to button
*/

import React from "react";
import { BUTTON_TYPE } from "./Button.constants";

export interface ButtonData {
  children: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: BUTTON_TYPE;

  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
