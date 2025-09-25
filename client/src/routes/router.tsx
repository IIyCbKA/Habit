import {
  createBrowserRouter,
  Outlet,
  type RouteObject,
} from "react-router-dom";
import { PATHS } from "./paths";
import { AnonGuard, AuthVerifiedGuard, IndexLoader } from "./guards";
import { authRoutes } from "@/features/Auth/routes";
import { homeRoutes } from "@/features/Home/routes";
import { LoadingOverlay } from "@/components";
import AuthVerifiedLayout from "@/features/Layouts/AuthVerifiedLayout";
import RootLayout from "@/features/Layouts/RootLayout";
import { accountRoutes } from "@/features/Account/routes";

const Fallback = () => <LoadingOverlay />;
const Empty = () => null;

const appRoutes: RouteObject[] = [
  {
    path: PATHS.DEFAULT,
    Component: RootLayout,
    HydrateFallback: Fallback,
    children: [
      { index: true, loader: IndexLoader, Component: Empty },

      {
        HydrateFallback: Fallback,
        loader: AnonGuard,
        Component: Outlet,
        children: [...authRoutes],
      },

      {
        HydrateFallback: Fallback,
        loader: AuthVerifiedGuard,
        Component: AuthVerifiedLayout,
        children: [...homeRoutes, ...accountRoutes],
      },

      { path: PATHS.OTHER_PATHS, loader: IndexLoader, Component: Empty },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);
