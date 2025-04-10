import React, { lazy } from "react";
import { Navigate, useRoutes, RouteObject } from "react-router-dom";
import Layout from "@/pages/Layout/Layout";
import { PATHS } from "@/shared/constants/Routes.constants";

const Auth = lazy(() => import("../pages/Auth/Auth"));

export default function PublicRoutes() {
  const routes: RouteObject[] = [
    {
      path: PATHS.DEFAULT,
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to={PATHS.AUTH} />,
        },
        {
          path: PATHS.AUTH,
          element: <Auth />,
        },
        {
          path: PATHS.ALL_PATHS,
          element: <Navigate to={PATHS.AUTH} />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}
