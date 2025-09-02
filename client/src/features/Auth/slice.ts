import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import {
  login as loginAPI,
  register as registerAPI,
  refresh as refreshAPI,
  logout as logoutAPI,
  emailConfirm as emailConfirmAPI,
  passwordResetRequest as passwordResetRequestAPI,
  passwordResetConfirm as passwordResetConfirmAPI,
} from "./api";
import { AuthState, CommonFulfilledResponse, User, AuthStatus } from "./types";
import { DEFAULT_USERNAME, SLISE_NAME } from "./constants";
import { RootState } from "@/store/store";
import { createAppAsyncThunk } from "@/store/apiThunk";

export const loginUser = createAppAsyncThunk(`${SLISE_NAME}/login`, loginAPI);
export const registerUser = createAppAsyncThunk(
  `${SLISE_NAME}/register`,
  registerAPI,
);
export const emailConfirm = createAppAsyncThunk(
  `${SLISE_NAME}/email/confirm`,
  emailConfirmAPI,
);
export const refreshAuth = createAppAsyncThunk(
  `${SLISE_NAME}/refresh`,
  refreshAPI,
);
export const logout = createAppAsyncThunk(`${SLISE_NAME}/logout`, logoutAPI);
export const passwordResetRequest = createAppAsyncThunk(
  `${SLISE_NAME}/password/reset/request`,
  passwordResetRequestAPI,
);
export const passwordResetConfirm = createAppAsyncThunk(
  `${SLISE_NAME}/password/reset/confirm`,
  passwordResetConfirmAPI,
);

const commonFulfilled = (
  state: AuthState,
  { payload: { user, accessToken } }: PayloadAction<CommonFulfilledResponse>,
) => {
  state.user = user;
  state.accessToken = accessToken;
  state.isAuth = user.isEmailVerified;
  state.status = "succeeded";
};

const commonLogout = (state: AuthState) => {
  state.user = null;
  state.accessToken = null;
  state.isAuth = false;
  state.status = "idle";
};

const authSlice = createSlice({
  name: SLISE_NAME,
  initialState: {
    user: null,
    accessToken: null,
    isAuth: false,
    status: "idle",
  } as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addMatcher(
        isAnyOf(
          loginUser.fulfilled,
          registerUser.fulfilled,
          refreshAuth.fulfilled,
          emailConfirm.fulfilled,
          passwordResetConfirm.fulfilled,
        ),
        commonFulfilled,
      )
      .addMatcher(
        isAnyOf(refreshAuth.rejected, logout.fulfilled),
        commonLogout,
      );
  },
});

export const selectIsAuth = (state: RootState): boolean => state.auth.isAuth;
export const selectUser = (state: RootState): User | null => state.auth.user;
export const selectAccessToken = (state: RootState): string | null =>
  state.auth.accessToken;
export const selectAuthStatus = (state: RootState): AuthStatus =>
  state.auth.status;
export const selectUsername = (state: RootState): string =>
  state.auth.user?.username ?? DEFAULT_USERNAME;
export const selectIsEmailVerified = (state: RootState): boolean | undefined =>
  state.auth.user?.isEmailVerified;

export default authSlice.reducer;
