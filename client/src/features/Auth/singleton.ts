import { store } from "@/store/store";
import { refreshAuth } from "./slice";

let authPromise: Promise<void> | null = null;

export const ensureAuthInitialized = async (): Promise<void> => {
  if (!authPromise) {
    authPromise = store.dispatch(refreshAuth()) as unknown as Promise<void>;
  }

  await authPromise;
};
