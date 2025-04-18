import { FormFieldType } from "./SignUpForm.enums";

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
