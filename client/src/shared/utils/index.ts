import {
  MINUTES_SECONDS_SUBSTR_END,
  MINUTES_SECONDS_SUBSTR_START,
  VALID_PASSWORD_REGULARLY,
} from "./constants";

export const validatePassword: (password: string) => boolean = (
  password: string,
): boolean => {
  return VALID_PASSWORD_REGULARLY.test(password);
};

export const seconds2MinutesSeconds: (seconds: number) => string = (
  seconds: number,
): string => {
  return new Date(seconds * 1000)
    .toISOString()
    .substring(MINUTES_SECONDS_SUBSTR_START, MINUTES_SECONDS_SUBSTR_END);
};
