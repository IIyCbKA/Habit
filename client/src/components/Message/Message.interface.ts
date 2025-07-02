/*
--------------MessageProps Interface--------------
variant   - variant of message style
*/

import { HTMLAttributes } from "react";
import { MessageVariant } from "./message.types";

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  variant: MessageVariant;
}
