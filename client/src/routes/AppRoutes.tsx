import React from "react";
import { RouterProvider } from "react-router-dom";
import { LoadingOverlay } from "@/components";
import { router } from "./router";

export default function AppRoutes(): React.ReactElement {
  return (
    <RouterProvider
      router={router}
      hydrateFallback={<LoadingOverlay overlayType="fullpage" />}
    />
  );
}
