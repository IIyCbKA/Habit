/*
--------------FormData Interface--------------
onClickChangeForm     - callback for click to button for change auth form
*/

import React from "react";

export interface FormData {
  onClickChangeForm: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
