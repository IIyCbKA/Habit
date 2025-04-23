import React from "react";
import { BrowserRouter } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuth } from "@/features/Auth/auth.slice";

export default function AppRoutes(): React.ReactElement {
  const isAuth = useAppSelector(selectIsAuth);

  const routes: React.ReactElement = React.useMemo(
    (): React.ReactElement => (isAuth ? <PrivateRoutes /> : <PublicRoutes />),
    [isAuth],
  );

  return <BrowserRouter>{routes}</BrowserRouter>;
}
