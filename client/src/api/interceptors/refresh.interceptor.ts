import {
  logout,
  refreshAuth,
  selectAccessToken,
} from "@/features/Auth/auth.slice";
import { store } from "@/store/store";
import { apiClient } from "../client";
import { InternalAxiosRequestConfig } from "axios";
import { RefreshSubscriber } from "./interceptors.types";
import { MISSING_TOKEN_ERROR } from "./interceptors.constants";

let isRefreshing: boolean = false;
let subscribers: RefreshSubscriber[] = [];

function addSubscriber(
  resolve: RefreshSubscriber["resolve"],
  reject: RefreshSubscriber["reject"],
): void {
  subscribers.push({ resolve, reject });
}

function onRefreshed(token: string): void {
  subscribers.forEach(({ resolve }: RefreshSubscriber): void => resolve(token));
  subscribers = [];
}

function onRefreshedFailed(error: any): void {
  subscribers.forEach(({ reject }: RefreshSubscriber): void => reject(error));
  subscribers = [];
}

const rejectedPromise: (error: any) => Promise<never> = (
  error: any,
): Promise<never> => {
  store.dispatch(logout());
  onRefreshedFailed(error);
  return Promise.reject(error);
};

const createRetryConfig: (
  config: InternalAxiosRequestConfig,
  token: string,
) => InternalAxiosRequestConfig = (
  config: any,
  token: string,
): InternalAxiosRequestConfig => {
  const retryConfig = { ...config };
  delete (retryConfig as any)._retry;
  retryConfig.headers = {
    ...retryConfig.headers,
    Authorization: `Bearer ${token}`,
  };

  return retryConfig;
};

export const refreshInterceptor: (
  config: InternalAxiosRequestConfig,
) => Promise<any> = async (config: any): Promise<any> => {
  config._retry = true;

  if (!isRefreshing) {
    isRefreshing = true;
    try {
      await store.dispatch(refreshAuth()).unwrap();
      const accessToken: string | null = selectAccessToken(store.getState());

      if (!accessToken) {
        return rejectedPromise(new Error(MISSING_TOKEN_ERROR));
      }

      onRefreshed(accessToken);
    } catch (refreshError) {
      return rejectedPromise(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return new Promise((resolve, reject): void => {
    addSubscriber(
      (token: string): void => {
        const retryConfig: InternalAxiosRequestConfig = createRetryConfig(
          config,
          token,
        );
        resolve(apiClient(retryConfig));
      },
      (error: any): void => {
        reject(error);
      },
    );
  });
};
