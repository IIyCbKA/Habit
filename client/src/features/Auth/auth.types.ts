import { AuthStatus } from "./auth.enums";

/*
--------------LoginCreds type--------------
username - name of user
password - password of user
*/
export interface LoginCreds {
  username: string;
  password: string;
}

/*
--------------RegisterCreds type--------------
username - name of new user
password - password of new user
email    - email of new user
*/
export interface RegisterCreds {
  username: string;
  password: string;
  email: string;
}

/*
--------------AuthState type--------------
This type is used in AuthSlice for initialState

user     - user data
isAuth   - trivial flag is user is auth user
status   - status of authorization
error    - error authorization log
*/
export interface AuthState {
  user: User | null;
  isAuth: boolean;
  status: AuthStatus;
  error?: string;
}

/*
--------------User type--------------
------------!!!PATTERN!!!------------
This type is used in AuthSlice in initialState for storing user information

username - name of user
*/
export interface User {
  username: string;
}

/*
--------------LoginResponse type--------------
This type is used in AuthSlice for response of loginAPI

user     - user data
token    - token of auth user
*/
export interface LoginResponse {
  user: User;
  token: string;
}

/*
--------------RegisterResponse type--------------
This type is used in AuthSlice for response of registerAPI

user     - user data
token    - token of auth user
*/
export interface RegisterResponse {
  user: User;
  token: string;
}
