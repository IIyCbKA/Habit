/*
--------------Form type--------------
*/
export type Form = "signIn" | "signUp";

/*
--------------AuthStatus type--------------
*/
export type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

/*
--------------EmailVerificationStatus type--------------
*/
export type EmailVerificationStatus = "idle" | "succeeded" | "failed";

/*
--------------LoginCreds type--------------
identifier - identifier of user (email or username)
password   - password of user
*/
export type LoginCreds = {
  identifier: string;
  password: string;
};

/*
--------------RegisterCreds type--------------
username - name of new user
password - password of new user
email    - email of new user
*/
export type RegisterCreds = {
  username: string;
  password: string;
  email: string;
};

/*
--------------AuthState type--------------
user                       - user data
accessToken                - access token of auth user
emailVerificationStatus    - utils value for verification status flag
isAuth                     - trivial flag is user is auth user
requiresEmailVerification  - flag about require
status                     - status of authorization
error                      - error authorization log
*/
export type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuth: boolean;
  emailVerificationStatus: EmailVerificationStatus;
  requiresEmailVerification: boolean;
  status: AuthStatus;
  error?: string;
};

/*
--------------User type--------------
*/
export type User = {
  id: number;
  username: string;
  email: string;
};

/*
--------------LoginResponse type--------------
accessToken                - access token of auth
user                       - user data
requiresEmailVerification  - flag about require
*/
export type LoginResponse = {
  accessToken: string;
  user: User;
  requiresEmailVerification?: boolean;
};

/*
--------------RegisterResponse type--------------
accessToken    - access token of auth
user           - user data
*/
export type RegisterResponse = {
  accessToken: string;
  user: User;
};

/*
--------------RefreshAuthResponse type--------------
accessToken    - access token of auth user
*/
export type RefreshResponse = {
  user: User;
  accessToken: string;
};

/*
--------------EmailConfirmCreds type--------------
email  - user email
code   - verification code
*/
export type EmailConfirmCreds = {
  email: string;
  code: string;
};
