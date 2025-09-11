import React, { ButtonHTMLAttributes } from "react";

/*
--------------Provider type--------------
*/
export type Provider = "github" | "google" | "facebook" | "x";

/*
--------------IconComponent type--------------
*/
export type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

/*
--------------ButtonElement type--------------
provider    - oauth provider
icon        - button image
*/

export type ButtonElement = ButtonHTMLAttributes<HTMLButtonElement> & {
  provider: Provider;
  icon: IconComponent;
};
