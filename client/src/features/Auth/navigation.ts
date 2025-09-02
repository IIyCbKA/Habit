import { startAppListening } from "@/store/listener";
import {
  emailConfirm,
  loginUser,
  logout,
  registerUser,
  passwordResetRequest,
  passwordResetConfirm,
} from "./slice";
import { router } from "@/routes/router";
import { PATHS } from "@/routes/paths";

export function setupAuthNavigation() {
  startAppListening({
    actionCreator: logout.fulfilled,
    effect: () => {
      router.navigate(PATHS.SIGN_IN, { replace: true });
    },
  });

  startAppListening({
    actionCreator: loginUser.fulfilled,
    effect: (action) => {
      const verified = action.payload.user.isEmailVerified;

      if (verified) router.navigate(PATHS.DASHBOARD, { replace: true });
      else router.navigate(PATHS.EMAIL_CONFIRM);
    },
  });

  startAppListening({
    actionCreator: registerUser.fulfilled,
    effect: () => {
      router.navigate(PATHS.EMAIL_CONFIRM);
    },
  });

  startAppListening({
    actionCreator: passwordResetRequest.fulfilled,
    effect: () => {
      router.navigate(PATHS.PASSWORD_FORGOT_SENT);
    },
  });

  startAppListening({
    actionCreator: emailConfirm.fulfilled,
    effect: () => {
      router.navigate(PATHS.DASHBOARD, { replace: true });
    },
  });

  startAppListening({
    actionCreator: passwordResetConfirm.fulfilled,
    effect: () => {
      router.navigate(PATHS.DASHBOARD, { replace: true });
    },
  });
}
