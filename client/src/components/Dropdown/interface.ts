/*
--------------DropdownProps Interface--------------
isOpen             - dropdown is show flag
animationDuration  - duration of opening/closing animation in ms
*/

import { HTMLAttributes } from "react";

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  animationDuration?: number;
}
