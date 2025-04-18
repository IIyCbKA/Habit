/*
--------------LinkToProps Interface--------------
children    - text in button
path        - path for link
className   - other styles
*/

import React from "react";

export interface LinkToProps {
  children: React.ReactNode;
  path: string;

  className?: string;
}
