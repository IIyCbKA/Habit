/*
--------------LinkToProps Interface--------------
className   - other styles
*/

import { LinkProps } from "react-router-dom";

export interface LinkToProps extends LinkProps {
  className?: string;
}
