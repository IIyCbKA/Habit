import React from "react";
import style from "./Button.module.css";
import { ButtonData } from "@/components/Button/Button.interface";

export default function Button({
  children,
  disabled,
  fullWidth,
  className,
  onClick,
}: ButtonData): React.ReactElement {
  return <button>{children}</button>;
}
