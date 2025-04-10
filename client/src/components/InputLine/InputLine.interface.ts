/*
--------------InputLineData Interface--------------
fullWidth   - flag is full parent width
placeholder - your placeholder
value       - value of input line
className   - other styles
onChange    - callback for changing current value
*/

import React from "react";

export interface InputLineData {
  fullWidth?: boolean;
  placeholder?: string;
  value?: string;

  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
