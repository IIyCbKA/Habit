export const enum ENDPOINT {
  LOGIN = "/auth/login/",
  PENDING_REGISTER = "/auth/register/",
  EMAIL_CONFIRM = "/auth/email/confirm/",
  REFRESH = "/auth/refresh/",
  LOGOUT = "/auth/logout/",
  VERIFY_CODE_RESEND = "/auth/code/resend/",
  PASSWORD_RESET_REQUEST = "/auth/password/reset/",
  PASSWORD_RESET_VALIDATE = "/auth/password/reset/validate/",
  PASSWORD_RESET_CONFIRM = "/auth/password/reset/confirm/",
}

export const enum HTTP_STATUS {
  UNAUTHORIZED = 401,
}
