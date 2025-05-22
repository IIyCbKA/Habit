/*
--------------DropdownProps Interface--------------
show   - dropdown is show flag
*/

import { HTMLAttributes } from "react";

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean;
}
