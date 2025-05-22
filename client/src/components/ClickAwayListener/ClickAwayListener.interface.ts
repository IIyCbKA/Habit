/*
--------------ClickAwayListenerProps Interface--------------
children        - func, which getting ref and returning React Element with this ref
onClickAway     - handler of click
clickEventType  - type of click event listener
touchEventType  - type of touch event listener
*/

import React from "react";
import { ClickType, TouchType } from "./clickAwayListener.enums";

export interface ClickAwayListenerProps {
  children: (ref: React.Ref<HTMLElement>) => React.ReactNode;
  onClickAway: () => void;
  clickEventType?: ClickType;
  touchEventType?: TouchType;
}
