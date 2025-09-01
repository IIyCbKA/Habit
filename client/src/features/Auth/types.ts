import React from "react";

/*
--------------AuthStatus type--------------
*/
export type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

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
--------------PasswordResetRequestData type--------------
email    - user email
*/
export type PasswordResetRequestData = {
  email: string;
};

/*
--------------AuthState type--------------
user                       - user data
accessToken                - access token of auth user
isAuth                     - trivial flag is user is auth user
status                     - status of authorization
*/
export type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuth: boolean;
  status: AuthStatus;
};

/*
--------------User type--------------
*/
export type User = {
  id: number;
  username: string;
  email: string;
  isEmailVerified: boolean;
};

/*
--------------CommonFulfilledResponse type--------------
accessToken                - access token of auth
user                       - user data
*/
export type CommonFulfilledResponse = {
  accessToken: string;
  user: User;
};

/*
--------------EmailConfirmData type--------------
code   - verification code
*/
export type EmailConfirmData = {
  code: string;
};

/*
--------------PasswordResetValidateData type--------------
*/
export type PasswordResetValidateData = {
  uid: string;
  token: string;
};
