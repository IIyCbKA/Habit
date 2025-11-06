import {
  CaseReducer,
  createSlice,
  isRejectedWithValue,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { SLICE_NAME } from "./constants";
import {
  NotificationData,
  NotificationID,
  NotificationInput,
  UiState,
} from "./types";
import {
  emailConfirm,
  loginUser,
  registerUser,
  passwordResetRequest,
  usernameUpdate,
} from "@/features/Auth/slice";
import { RootState } from "@/store/store";
import { RejectedPayload } from "@/store/types";

const createNotification = ({
  message,
  autoHideDuration = 5000,
}: NotificationInput): NotificationData => {
  const id: NotificationID = nanoid();
  return { id, message, autoHideDuration };
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
    notifications: [],
  } as UiState,
  reducers: {
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
    builder.addMatcher(
      isRejectedWithValue(
        loginUser,
        registerUser,
        emailConfirm,
        passwordResetRequest,
        usernameUpdate,
      ),
      commonAuthRejected,
    );
  },
});

export const { pushNotification, popNotification } = uiSlice.actions;
export const selectNotifications = (state: RootState) => state.ui.notifications;

export default uiSlice.reducer;
