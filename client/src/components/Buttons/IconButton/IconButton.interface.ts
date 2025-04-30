/*
--------------IconButtonProps Interface--------------
className   - other styles
*/

import { ButtonHTMLAttributes } from "react";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
