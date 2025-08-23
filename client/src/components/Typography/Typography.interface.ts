/*
--------------TypographyProps Interface--------------
variant       - heading variant tag
*/

import { HTMLAttributes } from "react";
import { TypographyVariant } from "./typography.types";

export interface TypographyProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: TypographyVariant;
}
