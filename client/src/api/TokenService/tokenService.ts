import { TOKEN_KEY } from "./tokenService.constants";

export const getToken: () => string | null = (): string | null =>
  localStorage.getItem(TOKEN_KEY);

export const setToken: (token: string) => void = (token: string): void =>
  localStorage.setItem(TOKEN_KEY, token);

export const clearToken: () => void = (): void =>
  localStorage.removeItem(TOKEN_KEY);
