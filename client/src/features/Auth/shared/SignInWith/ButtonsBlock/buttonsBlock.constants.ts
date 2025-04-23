import Github from "@/assets/icons/github_64x64.svg?react";
import Google from "@/assets/icons/google_64x64.svg?react";
import Facebook from "@/assets/icons/facebook_64x64.svg?react";
import X from "@/assets/icons/x_64x64.svg?react";
import { ButtonElement } from "./ButtonsBlock.types";
import styles from "./buttonsBlock.module.css";

export const ELEMENTS_LIST: ButtonElement[] = [
  {
    icon: Github,
    link: "/",
    ariaLabel: "Github",
    className: styles.githubButton,
  },
  {
    icon: Google,
    link: "/",
    ariaLabel: "Google",
    className: styles.googleButton,
  },
  {
    icon: Facebook,
    link: "/",
    ariaLabel: "Facebook",
    className: styles.facebookButton,
  },
  {
    icon: X,
    link: "/",
    ariaLabel: "X",
    className: styles.xButton,
  },
];
