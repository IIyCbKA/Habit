import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
  LoginResponse,
  RefreshResponse,
  RegisterCreds,
  RegisterResponse,
  EmailConfirmCreds,
  User,
  AuthStatus,
} from "./auth.types";
import { SLISE_NAME } from "./auth.constants";
import { RootState } from "@/store/store";

export const loginUser = createAsyncThunk<LoginResponse, LoginCreds>(
  `${SLISE_NAME}/login`,
  async (creds: LoginCreds): Promise<LoginResponse> => {
    return await loginAPI(creds);
  },
);

export const registerUser = createAsyncThunk<RegisterResponse, RegisterCreds>(
  `${SLISE_NAME}/register`,
  async (creds: RegisterCreds): Promise<RegisterResponse> => {
    return await registerAPI(creds);
  },
);

export const emailConfirm = createAsyncThunk<LoginResponse, EmailConfirmCreds>(
  `${SLISE_NAME}/email-confirm`,
  async (creds: EmailConfirmCreds): Promise<LoginResponse> => {
    return await emailConfirmAPI(creds);
  },
);

export const refreshAuth = createAsyncThunk<RefreshResponse>(
  `${SLISE_NAME}/refresh`,
  async (): Promise<RefreshResponse> => {
    return await refreshAPI();
  },
);

export const logout = createAsyncThunk(
  `${SLISE_NAME}/logout`,
  async (): Promise<any> => {
    return await logoutAPI();
  },
);

const authSlice = createSlice({
  name: SLISE_NAME,
  initialState: {
    user: null,
    accessToken: null,
    isAuth: false,
    emailVerificationStatus: "idle",
    requiresEmailVerification: false,
    status: "idle",
  } as AuthState,
  reducers: {
    forcedLogout: (state): void => {
      state.user = null;
      state.accessToken = null;
      state.isAuth = false;
    },
  },
  extraReducers: (builder): void => {
    builder
      .addCase(loginUser.pending, (state): void => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuth = !action.payload.requiresEmailVerification;
        state.status = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action): void => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state): void => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.requiresEmailVerification = true;
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action): void => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(refreshAuth.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuth = true;
        state.status = "succeeded";
      })
      .addCase(refreshAuth.rejected, (state, action): void => {
        state.user = null;
        state.accessToken = null;
        state.isAuth = false;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state): void => {
        state.user = null;
        state.accessToken = null;
        state.isAuth = false;
      })
      .addCase(emailConfirm.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuth = true;
        state.emailVerificationStatus = "succeeded";
        state.status = "succeeded";
      })
      .addCase(emailConfirm.rejected, (state): void => {
        state.emailVerificationStatus = "failed";
      });
  },
});

export const selectIsAuth = (state: RootState): boolean => state.auth.isAuth;
export const selectUser = (state: RootState): User | null => state.auth.user;
export const selectAccessToken = (state: RootState): string | null =>
  state.auth.accessToken;
export const selectAuthStatus = (state: RootState): AuthStatus =>
  state.auth.status;

export const { forcedLogout } = authSlice.actions;
export default authSlice.reducer;
