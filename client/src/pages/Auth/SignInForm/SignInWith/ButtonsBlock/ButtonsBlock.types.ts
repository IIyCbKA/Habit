import React from "react";

export interface ButtonElement {
  link: string;
  ariaLabel: string;

  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
}
