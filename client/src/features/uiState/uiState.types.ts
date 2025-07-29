/*
--------------Form type--------------
*/
export type Form = "signIn" | "signUp" | "confirmEmail";

export type UiState = {
  authForm: Form;
};
