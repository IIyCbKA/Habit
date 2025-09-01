/*
--------------DrawerProps Interface--------------
animationDuration  - duration of opening/closing animation in ms
isOpen             - drawer is open flag
*/

import { HTMLAttributes } from "react";

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  animationDuration?: number;
  isOpen: boolean;
}
