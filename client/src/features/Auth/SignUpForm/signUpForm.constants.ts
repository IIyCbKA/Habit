import { FormFieldType } from "./signUpForm.enums";

export const INPUT_ELEMENTS = {
  [FormFieldType.Username]: {
    placeholder: "Username",
    inputName: "username",
  },
  [FormFieldType.Password]: {
    placeholder: "Password",
    inputName: "password",
  },
  [FormFieldType.PasswordConfirmation]: {
    placeholder: "Confirm password",
    inputName: "passwordConfirmation",
  },
  [FormFieldType.Email]: {
    placeholder: "E-mail address",
    inputName: "email",
  },
};

export const SIGN_UP_BUTTON_TEXT = "Sign Up";
export const PASSWORD_CONFIRMATION_ERROR =
  "The passwords you entered do not match.";
export const PASSWORD_ERROR =
  "Must be at least 8 characters with letter and number, no special or non-ASCII characters.";
