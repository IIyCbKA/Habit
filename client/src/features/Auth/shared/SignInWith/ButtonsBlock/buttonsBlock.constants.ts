import Github from "@/assets/icons/github_64x64.svg?react";
import Google from "@/assets/icons/google_64x64.svg?react";
import Facebook from "@/assets/icons/facebook_64x64.svg?react";
import X from "@/assets/icons/x_64x64.svg?react";
import { ButtonElement } from "./ButtonsBlock.types";

export const ELEMENTS_LIST: ButtonElement[] = [
  {
    icon: Github,
    link: "/",
    ariaLabel: "Github",
  },
  {
    icon: Google,
    link: "/",
    ariaLabel: "Google",
  },
  {
    icon: Facebook,
    link: "/",
    ariaLabel: "Facebook",
  },
  {
    icon: X,
    link: "/",
    ariaLabel: "X",
  },
];
