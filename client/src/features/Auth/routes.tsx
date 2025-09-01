import { RouteObject } from "react-router-dom";
import { redirect } from "react-router";
import { PATHS } from "@/routes/paths";
import Auth from "./index";
import SignIn from "@/features/Auth/pages/SignIn";
import SignUp from "@/features/Auth/pages/SignUp";
import ConfirmEmail from "@/features/Auth/pages/ConfirmEmail";
import ForgotPassword from "@/features/Auth/pages/ForgotPassword";
import ForgotPasswordSent from "@/features/Auth/pages/ForgotPasswordSent";
import ResetPassword from "@/features/Auth/pages/ResetPassword";
import { confirmEmailGuard, resetPasswordGuard } from "./guards";

export const authRoutes: RouteObject[] = [
  {
    path: PATHS.AUTH,
    Component: Auth,
    children: [
      {
        index: true,
        loader: () => {
          throw redirect(PATHS.SIGN_IN);
        },
      },
      { path: PATHS.SIGN_IN, Component: SignIn },
      { path: PATHS.SIGN_UP, Component: SignUp },
      {
        path: PATHS.EMAIL_CONFIRM,
        Component: ConfirmEmail,
        loader: confirmEmailGuard,
      },
      { path: PATHS.PASSWORD_FORGOT, Component: ForgotPassword },
      { path: PATHS.PASSWORD_FORGOT_SENT, Component: ForgotPasswordSent },
      {
        path: PATHS.PASSWORD_RESET,
        Component: ResetPassword,
        loader: resetPasswordGuard,
      },
    ],
  },
];
