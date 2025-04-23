/*
--------------FormProps Interface--------------
toggleFormType     - callback for click to button for change auth form
*/

import React from "react";

export interface FormProps {
  toggleFormType: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/*
--------------ActionBarProps Interface--------------
toggleFormType     - callback for click to button for change auth form
*/

export interface ActionBarProps {
  toggleFormType: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
