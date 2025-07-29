import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  login as loginAPI,
  register as registerAPI,
  refresh as refreshAPI,
  logout as logoutAPI,
  emailConfirm as emailConfirmAPI,
} from "./auth.api";
import {
  AuthState,
  LoginCreds,
  CommonFulfilledResponse,
  RegisterCreds,
  User,
  AuthStatus,
  EmailConfirmCreds,
} from "./auth.types";
import { SLISE_NAME } from "./auth.constants";
import { RootState } from "@/store/store";

export const loginUser = createAsyncThunk<CommonFulfilledResponse, LoginCreds>(
  `${SLISE_NAME}/login`,
  async (creds: LoginCreds): Promise<CommonFulfilledResponse> => {
    return await loginAPI(creds);
  },
);

export const registerUser = createAsyncThunk<
  CommonFulfilledResponse,
  RegisterCreds
>(
  `${SLISE_NAME}/register`,
  async (creds: RegisterCreds): Promise<CommonFulfilledResponse> => {
    return await registerAPI(creds);
  },
);

export const emailConfirm = createAsyncThunk<
  CommonFulfilledResponse,
  EmailConfirmCreds
>(
  `${SLISE_NAME}/email-confirm`,
  async (creds: EmailConfirmCreds): Promise<CommonFulfilledResponse> => {
    return await emailConfirmAPI(creds);
  },
);

export const refreshAuth = createAsyncThunk<CommonFulfilledResponse>(
  `${SLISE_NAME}/refresh`,
  async (): Promise<CommonFulfilledResponse> => {
    return await refreshAPI();
  },
);

export const logout = createAsyncThunk(
  `${SLISE_NAME}/logout`,
  async (): Promise<any> => {
    return await logoutAPI();
  },
);

const commonFulfilled = (
  state: AuthState,
  { payload: { user, accessToken } }: PayloadAction<CommonFulfilledResponse>,
): void => {
  state.user = user;
  state.accessToken = accessToken;
  state.isAuth = user.isEmailVerified;
  state.status = "succeeded";
};

const commonLogout = (state: AuthState): void => {
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
  extraReducers: (builder): void => {
    builder
      .addCase(loginUser.pending, (state): void => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(loginUser.rejected, (state, action): void => {
        state.status = "failed";
        state.error = action.error.message;
      });

    builder
      .addMatcher(
        isAnyOf(
          loginUser.fulfilled,
          registerUser.fulfilled,
          refreshAuth.fulfilled,
          emailConfirm.fulfilled,
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

export default authSlice.reducer;
