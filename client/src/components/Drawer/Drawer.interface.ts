/*
--------------DrawerProps Interface--------------
animationDuration  - duration of opening/closing animation
isOpen             - drawer is open flag
*/

import { HTMLAttributes } from "react";

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  animationDuration?: number;
  isOpen: boolean;
}
