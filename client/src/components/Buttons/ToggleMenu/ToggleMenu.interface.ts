/*
--------------ToggleMenuProps Interface--------------
isOpen     - flag, menu is open
isOverlay  - flag, toggle is overlay (added z-index style)
*/

import { HTMLAttributes } from "react";

export interface ToggleMenuProps extends HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  isOverlay?: boolean;
}
