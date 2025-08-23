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
import { AuthScreen } from "./uiState.types";
import {
  emailConfirm,
  loginUser,
  logout,
  refreshAuth,
  registerUser,
  resetPassword,
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
  state.authScreen = "signIn";
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
    authScreen: "signIn",
    notifications: [],
  } as UiState,
  reducers: {
    setAuthScreen(state, action: PayloadAction<AuthScreen>) {
      state.authScreen = action.payload;
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
        state.authScreen = "confirmEmail";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authScreen = action.payload.user.isEmailVerified
          ? "signIn"
          : "confirmEmail";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.authScreen = "forgotPasswordSent";
      });

    builder
      .addMatcher(isAnyOf(refreshAuth.rejected, logout.fulfilled), commonLogout)
      .addMatcher(
        isRejectedWithValue(
          loginUser,
          registerUser,
          emailConfirm,
          resetPassword,
        ),
        commonAuthRejected,
      );
  },
});

export const { setAuthScreen, pushNotification, popNotification } =
  uiSlice.actions;
export const selectAuthScreen = (state: RootState) => state.ui.authScreen;
export const selectNotifications = (state: RootState) => state.ui.notifications;

export default uiSlice.reducer;
