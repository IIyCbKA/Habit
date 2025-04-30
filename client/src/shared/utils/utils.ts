import { VALID_PASSWORD_REGULARLY } from "./utils.constants";

export const validatePassword: (password: string) => boolean = (
  password: string,
): boolean => {
  return VALID_PASSWORD_REGULARLY.test(password);
};
