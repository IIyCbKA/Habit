import { Github, Google, Facebook, XIcon } from "@/assets/icons";
import { ButtonElement } from "./types";

export const ELEMENTS_LIST: ButtonElement[] = [
  {
    icon: Github,
    provider: "github",
  },
  {
    icon: Google,
    provider: "google",
    disabled: true,
  },
  {
    icon: Facebook,
    provider: "facebook",
    disabled: true,
  },
  {
    icon: XIcon,
    provider: "x",
    disabled: true,
  },
];
