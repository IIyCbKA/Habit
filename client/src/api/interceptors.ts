import { apiClient } from "./client";
import { getToken } from "./TokenService/tokenService";
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token: string | null = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: any): Promise<never> => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: any): Promise<never> => {
    // mb add refresh token?
    // errors handler with example

    // if (error.response?.status === 401) {
    //   store.dispatch(logout());
    // }
    return Promise.reject(error);
  },
);
