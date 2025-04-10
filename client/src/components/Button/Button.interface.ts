/*
--------------ButtonData Interface--------------
fullWidth   - flag is full parent width
children    - text in button
className   - other styles
onClick     - callback for click to button
*/

import React from "react";

export interface ButtonData {
  children: React.ReactNode;
  // btn type
  disabled?: boolean;
  fullWidth?: boolean;

  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
