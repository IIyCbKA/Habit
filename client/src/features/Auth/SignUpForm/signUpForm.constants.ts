import { FieldConfigMap } from "./SignUpForm.types";

export const INPUT_ELEMENTS: FieldConfigMap = {
  username: {
    placeholder: "Username",
    inputName: "username",
  },
  password: {
    placeholder: "Password",
    inputName: "password",
  },
  passwordConfirmation: {
    placeholder: "Confirm password",
    inputName: "passwordConfirmation",
  },
  email: {
    placeholder: "E-mail address",
    inputName: "email",
  },
};

export const SIGN_UP_BUTTON_TEXT = "Sign Up";
