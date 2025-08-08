/*
--------------LinearProgressProps Interface--------------
value  - number from 0 to 100 indicating the current progress percentage
*/

import { HTMLAttributes } from "react";

export interface LinearProgressProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
}
