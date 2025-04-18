/*
--------------TextFieldType enum--------------
The enum TextFieldType specifies type of text field.
By default, type is Text.
*/
export const enum TextFieldType {
  Text = "text",
  Email = "email",
  Password = "password",
  Number = "number",
}

/*
--------------AutoCompleteMode enum--------------
The enum AutoCompleteMode specifies mode of text field.
By default, mode is Off.
*/
export const enum AutoCompleteMode {
  NewPassword = "new-password",
  CurrentPassword = "current-password",
  Email = "email",
  Name = "name",
  Off = "off",
}
