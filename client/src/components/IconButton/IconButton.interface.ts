/*
--------------IconButtonData Interface--------------
children    - icon for button
disabled    - flag is button is disabled
className   - other styles
onClick     - callback for click to button
*/

import React from "react";

export interface IconButtonData {
  children: React.ReactNode;
  disabled?: boolean;

  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
