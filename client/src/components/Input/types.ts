import { HTMLAttributes } from "react";

/*
--------------HelperProps type--------------
text   - helper text displayed under the input
error  - flag indicating that the helper text represents an error
*/
export type HelperProps = HTMLAttributes<HTMLDivElement> & {
  text?: string;
  error?: boolean;
};
