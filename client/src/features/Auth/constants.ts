export const SLISE_NAME = "auth";
export const DEFAULT_USERNAME = "Guest";
export const PASSWORD_MIN_LENGTH = 8;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_RE = new RegExp(
  `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{${PASSWORD_MIN_LENGTH},}$`,
);

export const EMPTY_FIELD_ERROR = "This field cannot be empty";
export const INCORRECT_EMAIL_ERROR = "Please enter a valid email address";
export const INCORRECT_PASSWORD_ERROR = `Password must be at least ${PASSWORD_MIN_LENGTH} characters long and include both letters and numbers`;
export const PASSWORDS_DO_NOT_MATCH_ERROR = "Passwords do not match";
