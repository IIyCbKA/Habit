/*
--------------DividerProps Interface--------------
flexItem    - parent box is flex
orientation - divider orientation
variant     - ratio of divider length to total length
className   - other styles
*/

import { DIVIDER_ORIENTATIONS, DIVIDER_VARIANTS } from "./divider.constants";
import { HTMLAttributes } from "react";

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  flexItem?: boolean;
  orientation?: DIVIDER_ORIENTATIONS;
  variant?: DIVIDER_VARIANTS;

  className?: string;
}
