import React from "react";
import { Navigate, useRoutes, RouteObject } from "react-router-dom";
import Layout from "@/features/Layout/Layout";
import { PRIVATE_PATHS } from "./privateRoutes.constants";
import Home from "@/features/Home/Home";

export default function PrivateRoutes() {
  const routes: RouteObject[] = [
    {
      path: PRIVATE_PATHS.DEFAULT,
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: PRIVATE_PATHS.OTHER_PATHS,
          element: <Navigate to={PRIVATE_PATHS.DEFAULT} replace />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}
