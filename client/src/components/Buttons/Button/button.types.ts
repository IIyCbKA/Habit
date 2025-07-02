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
--------------PositionedAdornment type--------------
content    - adornment content
className  - classNames for adornment
position   - adornment position
*/
export type PositionedAdornment = Partial<Adornment> & { position: Position };
