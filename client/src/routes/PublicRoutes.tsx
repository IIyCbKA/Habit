import React, { lazy } from "react";
import { Navigate, useRoutes, RouteObject } from "react-router-dom";
import Layout from "@/pages/Layout/Layout";
import { PUBLIC_PATHS } from "./PublicRoutes.constants";

const Auth = lazy(() => import("@/pages/Auth/Auth"));

export default function PublicRoutes() {
  const routes: RouteObject[] = [
    {
      path: PUBLIC_PATHS.DEFAULT,
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to={PUBLIC_PATHS.AUTH} />,
        },
        {
          path: PUBLIC_PATHS.AUTH,
          element: <Auth />,
        },
        {
          path: PUBLIC_PATHS.RESET_PASSWORD,
          element: <Navigate to={PUBLIC_PATHS.AUTH} />,
        },
        {
          path: PUBLIC_PATHS.OTHER_PATHS,
          element: <Navigate to={PUBLIC_PATHS.AUTH} />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}
