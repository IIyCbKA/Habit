/*
--------------MessageProps Interface--------------
children  - text of message
variant   - variant of message style
className - other styles
*/

import React from "react";
import { MessageVariant } from "./message.enums";

export interface MessageProps {
  children: React.ReactNode;
  variant: MessageVariant;
  className?: string;
}
