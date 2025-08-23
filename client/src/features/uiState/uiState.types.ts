/*
--------------AuthScreen type--------------
*/
export type AuthScreen =
  | "signIn"
  | "signUp"
  | "confirmEmail"
  | "forgotPassword"
  | "forgotPasswordSent";

/*
--------------NotificationID type--------------
*/
export type NotificationID = string;

/*
--------------NotificationInput type--------------
*/
export type NotificationInput = {
  message: string;
  autoHideDuration?: number;
};

/*
--------------NotificationData type--------------
*/
export type NotificationData = {
  id: NotificationID;
  message: string;
  autoHideDuration: number;
};

export type UiState = {
  authScreen: AuthScreen;
  notifications: NotificationData[];
};
