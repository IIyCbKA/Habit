import React from "react";

/*
--------------ButtonElement Interface--------------
link        - link when clicking on button
ariaLabel   - text hint for icon of button
icon        - image in button
className   - other styles
*/

export interface ButtonElement {
  link: string;
  ariaLabel: string;

  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
}
