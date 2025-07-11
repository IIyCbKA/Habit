import React from "react";

/*
--------------FormProps Interface--------------
toggleFormType     - callback for click to button for change auth form
*/
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
