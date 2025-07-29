export const enum ENDPOINT {
  LOGIN = "/auth/login/",
  PENDING_REGISTER = "/auth/register/",
  EMAIL_CONFIRM = "/auth/email/confirm/",
  REFRESH = "/auth/refresh/",
  LOGOUT = "/auth/logout/",
  VERIFY_CODE_RESEND = "/auth/code/resend/",
}

export const enum HTTP_STATUS {
  UNAUTHORIZED = 401,
}
