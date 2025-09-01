import { refreshAuth, selectAccessToken } from "@/features/Auth/slice";
import { store } from "@/store/store";
import { apiClient } from "../clients";
import { InternalAxiosRequestConfig } from "axios";
import { RefreshSubscriber } from "./types";
import { MISSING_TOKEN_ERROR } from "./constants";

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

export const refreshInterceptor: (
  config: InternalAxiosRequestConfig,
) => Promise<any> = async (config: any): Promise<any> => {
  config._retry = true;

  const retryRequest = new Promise((resolve, reject) => {
    addSubscriber(
      (token: string) => {
        const retryCfg: InternalAxiosRequestConfig = {
          ...config,
          headers: { ...config.headers, Authorization: `Bearer ${token}` },
        };
        resolve(apiClient(retryCfg));
      },
      (err: any) => reject(err),
    );
  });

  if (isRefreshing) return retryRequest;

  isRefreshing = true;

  store
    .dispatch(refreshAuth())
    .unwrap()
    .then(() => {
      const newAccess = selectAccessToken(store.getState());
      if (!newAccess) throw new Error(MISSING_TOKEN_ERROR);
      onRefreshed(newAccess);
    })
    .catch((err) => {
      onRefreshedFailed(err);
    })
    .finally(() => {
      isRefreshing = false;
    });

  return retryRequest;
};
