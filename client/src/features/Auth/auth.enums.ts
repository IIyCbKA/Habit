/*
--------------FormType enum--------------
The enum FormType specifies type of form for auth page.
By default, type is SignIn.
*/
export const enum FormType {
  SignIn,
  SignUp,
}

/*
--------------AuthStatus enum--------------
The enum AuthStatus specifies status of auth of user.
By default, status is IDLE.
*/
export const enum AuthStatus {
  IDLE,
  LOADING,
  SUCCEEDED,
  FAILED,
}
