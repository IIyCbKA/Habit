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
import { LoadingOverlay } from "@/components";

const Fallback = () => <LoadingOverlay />;

const appRoutes: RouteObject[] = [
  {
    path: PATHS.DEFAULT,
    Component: Layout,
    HydrateFallback: Fallback,
    children: [
      { index: true, loader: IndexLoader, Component: () => null },

      {
        HydrateFallback: Fallback,
        loader: AnonGuard,
        Component: Outlet,
        children: [...authRoutes],
      },

      {
        HydrateFallback: Fallback,
        loader: AuthVerifiedGuard,
        Component: Outlet,
        children: [...homeRoutes],
      },

      { path: PATHS.OTHER_PATHS, loader: IndexLoader },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);
