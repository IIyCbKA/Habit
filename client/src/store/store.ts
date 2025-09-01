import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { listenerMiddleware } from "./listener";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
