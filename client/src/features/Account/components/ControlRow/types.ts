import React, { HTMLAttributes } from "react";
import { ButtonProps } from "@/components/Buttons/Button/interface";

/*
-------------ExtendedButtonProps type--------------
*/
export type ExtendedButtonProps = ButtonProps & {
  children: React.ReactNode;
};

/*
-------------IconProps type--------------
*/
export type IconProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

/*
-------------DividerWithConditionProps type--------------
*/
export type DividerWithConditionProps = {
  isWithout: boolean;
};
