import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { PATHS } from "./paths";
import { AnonGuard, AuthVerifiedGuard, IndexRedirect } from "./guards";
import Layout from "@/features/Layout";
import { authRoutes } from "@/features/Auth/routes";
import { routes } from "@/features/Home/routes";

const appRoutes: RouteObject[] = [
  {
    path: PATHS.DEFAULT,
    Component: Layout,
    children: [
      { index: true, Component: IndexRedirect },

      {
        Component: AnonGuard,
        children: [...authRoutes],
      },

      {
        Component: AuthVerifiedGuard,
        children: [...routes],
      },

      { path: PATHS.OTHER_PATHS, Component: IndexRedirect },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);
