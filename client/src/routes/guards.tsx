import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuth } from "@/features/Auth/slice";
import { LoadingOverlay } from "@/components";

export const IndexRedirect = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuth) navigate(PATHS.DASHBOARD, { replace: true });
    else navigate(PATHS.SIGN_IN, { replace: true });
  }, [isAuth, navigate]);

  return <LoadingOverlay overlayType={"fullpage"} />;
};

export const AuthVerifiedGuard = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuth) navigate(PATHS.SIGN_IN, { replace: true });
  }, [isAuth, navigate]);

  if (!isAuth) return <LoadingOverlay overlayType={"fullpage"} />;

  return <Outlet />;
};

export const AnonGuard = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuth) navigate(PATHS.DASHBOARD, { replace: true });
  }, [isAuth, navigate]);

  if (isAuth) return <LoadingOverlay overlayType={"fullpage"} />;

  return <Outlet />;
};
