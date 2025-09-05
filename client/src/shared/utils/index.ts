import {
  MINUTES_SECONDS_SUBSTR_END,
  MINUTES_SECONDS_SUBSTR_START,
} from "./constants";

export const seconds2MinutesSeconds: (seconds: number) => string = (
  seconds: number,
): string => {
  return new Date(seconds * 1000)
    .toISOString()
    .substring(MINUTES_SECONDS_SUBSTR_START, MINUTES_SECONDS_SUBSTR_END);
};
