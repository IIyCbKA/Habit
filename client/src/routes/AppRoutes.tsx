import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAppDispatch } from "@/store/hooks";
import { refreshAuth } from "@/features/Auth/slice";
import { LoadingOverlay } from "@/components";

export default function AppRoutes(): React.ReactElement {
  const [booting, setBooting] = React.useState(true);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    (async () => {
      try {
        await dispatch(refreshAuth()).unwrap();
      } catch (e) {
      } finally {
        setBooting(false);
      }
    })();
  }, [dispatch]);

  if (booting) return <LoadingOverlay overlayType={"fullpage"} />;

  return <RouterProvider router={router} />;
}
