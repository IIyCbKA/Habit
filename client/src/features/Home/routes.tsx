import { RouteObject } from "react-router-dom";
import Home from "./index";
import { PATHS } from "@/routes/paths";

export const homeRoutes: RouteObject[] = [
  {
    path: PATHS.DASHBOARD,
    Component: Home,
  },
];
