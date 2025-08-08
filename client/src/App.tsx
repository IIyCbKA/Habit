import React from "react";
import "./index.css";
import "./api/interceptors/interceptors";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import NotificationStack from "@/components/NotificationStack/NotificationStack";

export default function App(): React.ReactElement {
  return (
    <>
      <Provider store={store}>
        <AppRoutes />
        <NotificationStack />
      </Provider>
    </>
  );
}
