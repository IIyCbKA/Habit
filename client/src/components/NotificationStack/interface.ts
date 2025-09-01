/*
--------------NotificationStackProps Interface--------------
vertical    - vertical position of the notification stack on screen
horizontal  - horizontal position of the notification stack on screen
*/

import { HTMLAttributes } from "react";
import { Horizontal, Vertical } from "./types";
import { NotificationProps } from "@/components/Notification/interface";

type StackSlideProp = Pick<NotificationProps, "slideFrom">;

export interface NotificationStackProps
  extends HTMLAttributes<HTMLDivElement>,
    StackSlideProp {
  vertical?: Vertical;
  horizontal?: Horizontal;
}
