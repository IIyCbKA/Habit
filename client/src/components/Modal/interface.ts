/*
--------------ModalProps Interface--------------
isOpen             - modal is open flag
animationDuration  - duration of opening/closing animation in ms
withCloseButton    - modal has default close button flag
onClose            - handler for close event
onExited           - exited (after animation) callback
closeButtonProps   - Props forwarded to close button
rootProps          - Props forwarded to modal root
*/

import { HTMLAttributes, ButtonHTMLAttributes } from "react";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  animationDuration?: number;
  withCloseButton?: boolean;

  onClose: () => void;
  onExited?: () => void;
  closeButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  rootProps?: HTMLAttributes<HTMLDivElement>;
}
