import React from "react";

/*
--------------CloseButtonProps type--------------
*/
export type CloseButtonProps = {
  isShow: boolean;

  onClick: () => void;
  closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};
