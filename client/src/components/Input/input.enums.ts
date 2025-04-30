/*
--------------InputType enum--------------
The enum InputType specifies type of input.
By default, type is Text.
*/
export const enum InputType {
  Text = "text",
  Email = "email",
  Password = "password",
  Number = "number",
}

/*
--------------AutoCompleteMode enum--------------
The enum AutoCompleteMode specifies mode of input.
By default, mode is Off.
*/
export const enum AutoCompleteMode {
  NewPassword = "new-password",
  CurrentPassword = "current-password",
  Email = "email",
  Name = "name",
  Off = "off",
  Username = "username",
}
