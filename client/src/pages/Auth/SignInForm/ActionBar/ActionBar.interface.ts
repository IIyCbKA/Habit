/*
--------------ActionBarData Interface--------------
onClickSignUpButton     - callback for click to sign up button
*/

import React from "react";

export interface ActionBarData {
  onClickSignUpButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
