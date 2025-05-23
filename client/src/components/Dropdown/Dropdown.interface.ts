/*
--------------DropdownProps Interface--------------
show      - dropdown is show flag
children  - content for dropdown
*/

import React, { HTMLAttributes } from "react";

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean;

  children?: React.ReactNode;
}
