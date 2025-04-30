/*
--------------MessageProps Interface--------------
variant   - variant of message style
className - other styles
*/

import { HTMLAttributes } from "react";
import { MessageVariant } from "./message.enums";

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  variant: MessageVariant;
  className?: string;
}
