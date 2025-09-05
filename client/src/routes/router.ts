import {
  createBrowserRouter,
  Outlet,
  type RouteObject,
} from "react-router-dom";
import { PATHS } from "./paths";
import { AnonGuard, AuthVerifiedGuard, IndexLoader } from "./guards";
import Layout from "@/features/Layout";
import { authRoutes } from "@/features/Auth/routes";
import { homeRoutes } from "@/features/Home/routes";

const appRoutes: RouteObject[] = [
  {
    path: PATHS.DEFAULT,
    Component: Layout,
    children: [
      { index: true, loader: IndexLoader, Component: () => null },

      {
        loader: AnonGuard,
        Component: Outlet,
        children: [...authRoutes],
      },

      {
        loader: AuthVerifiedGuard,
        Component: Outlet,
        children: [...homeRoutes],
      },

      { path: PATHS.OTHER_PATHS, loader: IndexLoader },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);
