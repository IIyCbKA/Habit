import { apiClient } from "../client";
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { selectAccessToken } from "@/features/Auth/auth.slice";
import { HTTP_STATUS } from "../config.enums";
import { store } from "@/store/store";
import { refreshInterceptor } from "./refresh.interceptor";

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken: string | null = selectAccessToken(store.getState());
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error: any): Promise<never> => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: any): Promise<any> => {
    const { config, response } = error;
    if (response?.status === HTTP_STATUS.UNAUTHORIZED && !config._retry) {
      return refreshInterceptor(config);
    }

    return Promise.reject(error);
  },
);
