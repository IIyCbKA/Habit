/*
--------------IconButtonProps Interface--------------
disabled    - flag is button is disabled
children    - icon for button
className   - other styles
onClick     - callback for click to button
type        - html-type of button
*/

import React from "react";
import { ButtonType } from "../shared.enums";

export interface IconButtonProps {
  disabled?: boolean;

  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonType;
}
