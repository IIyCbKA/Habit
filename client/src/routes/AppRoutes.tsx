import React from "react";
import { BrowserRouter } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshAuth, selectIsAuth } from "@/features/Auth/auth.slice";

export default function AppRoutes(): React.ReactElement {
  const isAuth = useAppSelector(selectIsAuth);
  const dispatch = useAppDispatch();

  React.useEffect((): void => {
    dispatch(refreshAuth());
  }, [dispatch]);

  const routes: React.ReactElement = React.useMemo(
    (): React.ReactElement => (isAuth ? <PrivateRoutes /> : <PublicRoutes />),
    [isAuth],
  );

  return <BrowserRouter>{routes}</BrowserRouter>;
}
