import React from "react";

/*
--------------ButtonVariant type--------------
The type ButtonVariant specifies variant a set of styles for button.
By default, type is text.
*/
export type ButtonVariant = "text" | "contained" | "outlined";

/*
--------------Adornment type--------------
content    - adornment content
className  - classNames for adornment
*/
export type Adornment = {
  content: React.ReactNode;
  className?: string;
};

/*
-------------Position type--------------
*/
export type Position = "start" | "end";

/*
--------------PositionedAdornmentProps type--------------
content    - adornment content
className  - classNames for adornment
position   - adornment position
*/
export type PositionedAdornmentProps = Partial<Adornment> & {
  position: Position;
};

/*
--------------LoadingSpinnerProps type--------------
isLoading    - flag that button in process
*/
export type LoadingSpinnerProps = {
  isLoading?: boolean;
};
