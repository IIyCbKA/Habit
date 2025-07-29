import { FormComponents } from "./auth.types";
import SignInForm from "./SignInForm/SignInForm";
import SignUpForm from "./SignUpForm/SignUpForm";
import ConfirmEmailForm from "./ConfirmEmailForm/ConfirmEmailForm";

export const SLISE_NAME = "auth";
export const FORM_COMPONENTS: FormComponents = {
  signIn: SignInForm,
  signUp: SignUpForm,
  confirmEmail: ConfirmEmailForm,
};
