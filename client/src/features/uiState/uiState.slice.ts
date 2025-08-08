import {
  CaseReducer,
  createSlice,
  isAnyOf,
  isRejectedWithValue,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { SLICE_NAME } from "./uiState.constants";
import {
  NotificationData,
  NotificationID,
  NotificationInput,
  UiState,
} from "./uiState.types";
import { Form } from "./uiState.types";
import {
  emailConfirm,
  loginUser,
  logout,
  refreshAuth,
  registerUser,
} from "@/features/Auth/auth.slice";
import { RootState } from "@/store/store";
import { RejectedPayload } from "@/store/store.types";

const createNotification = ({
  message,
  autoHideDuration = 5000,
}: NotificationInput): NotificationData => {
  const id: NotificationID = nanoid();
  return { id, message, autoHideDuration };
};

const commonLogout = (state: UiState) => {
  state.authForm = "signIn";
};

const commonAuthRejected: CaseReducer<
  UiState,
  PayloadAction<RejectedPayload>
> = (state, action) => {
  const message = action.payload.detail;
  state.notifications.push(createNotification({ message }));
};

const uiSlice = createSlice({
  name: SLICE_NAME,
  initialState: {
    authForm: "signIn",
    notifications: [],
  } as UiState,
  reducers: {
    setAuthForm(state, action: PayloadAction<Form>) {
      state.authForm = action.payload;
    },

    pushNotification: {
      reducer: (state, action: PayloadAction<NotificationData>) => {
        state.notifications.push(action.payload);
      },
      prepare: (data: NotificationInput): { payload: NotificationData } => {
        return { payload: createNotification(data) };
      },
    },
    popNotification: (state, action: PayloadAction<NotificationID>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state) => {
        state.authForm = "confirmEmail";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authForm = action.payload.user.isEmailVerified
          ? "signIn"
          : "confirmEmail";
      });

    builder
      .addMatcher(isAnyOf(refreshAuth.rejected, logout.fulfilled), commonLogout)
      .addMatcher(
        isRejectedWithValue(loginUser, registerUser, emailConfirm),
        commonAuthRejected,
      );
  },
});

export const { setAuthForm, pushNotification, popNotification } =
  uiSlice.actions;
export const selectAuthForm = (state: RootState) => state.ui.authForm;
export const selectNotifications = (state: RootState) => state.ui.notifications;

export default uiSlice.reducer;
