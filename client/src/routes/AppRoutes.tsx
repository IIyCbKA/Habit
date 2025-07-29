import React from "react";
import { BrowserRouter } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshAuth, selectIsAuth } from "@/features/Auth/auth.slice";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";

export default function AppRoutes(): React.ReactElement {
  const [isWaitingAuth, setIsWaitingAuth] = React.useState(true);
  const isAuth = useAppSelector(selectIsAuth);
  const dispatch = useAppDispatch();

  React.useEffect((): void => {
    (async (): Promise<void> => {
      try {
        await dispatch(refreshAuth()).unwrap();
      } catch (err) {
      } finally {
        setIsWaitingAuth(false);
      }
    })();
  }, [dispatch]);

  const routes: React.ReactElement = React.useMemo(
    (): React.ReactElement =>
      isWaitingAuth ? (
        <LoadingOverlay overlayType={"fullpage"} />
      ) : isAuth ? (
        <PrivateRoutes />
      ) : (
        <PublicRoutes />
      ),
    [isAuth, isWaitingAuth],
  );

  return <BrowserRouter>{routes}</BrowserRouter>;
}
