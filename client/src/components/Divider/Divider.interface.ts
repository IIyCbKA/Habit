/*
--------------DividerData Interface--------------
flexItem    - parent box is flex
orientation - divider orientation
variant     - ratio of divider length to total length
className   - other styles
*/

import { DIVIDER_ORIENTATIONS, DIVIDER_VARIANTS } from "./Divider.constants";

export interface DividerData {
  flexItem?: boolean;
  orientation?: DIVIDER_ORIENTATIONS;
  variant?: DIVIDER_VARIANTS;

  className?: string;
}
