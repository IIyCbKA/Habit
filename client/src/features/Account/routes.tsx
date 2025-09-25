import { RouteObject } from "react-router-dom";
import Account from "./index";
import { PATHS } from "@/routes/paths";
import RootAccount from "@/features/Account/pages/Root";

export const accountRoutes: RouteObject[] = [
  {
    path: PATHS.ACCOUNT,
    Component: Account,
    children: [{ index: true, Component: RootAccount }],
  },
];
