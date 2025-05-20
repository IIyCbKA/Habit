import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  login as loginAPI,
  register as registerAPI,
  refresh as refreshAPI,
} from "./auth.api";
import {
  AuthState,
  LoginCreds,
  LoginResponse,
  RefreshResponse,
  RegisterCreds,
  RegisterResponse,
  User,
} from "./auth.types";
import { SLISE_NAME } from "./auth.constants";
import { AuthStatus } from "./auth.enums";
import { RootState } from "@/store/store";

export const loginUser = createAsyncThunk<LoginResponse, LoginCreds>(
  `${SLISE_NAME}/login`,
  async (creds: LoginCreds): Promise<any> => {
    return await loginAPI(creds);
  },
);

export const registerUser = createAsyncThunk<RegisterResponse, RegisterCreds>(
  `${SLISE_NAME}/register`,
  async (creds: RegisterCreds): Promise<any> => {
    return await registerAPI(creds);
  },
);

export const refreshAuth = createAsyncThunk<RefreshResponse>(
  `${SLISE_NAME}/refresh`,
  async (): Promise<any> => {
    return await refreshAPI();
  },
);

const authSlice = createSlice({
  name: SLISE_NAME,
  initialState: {
    user: null,
    accessToken: null,
    isAuth: false,
    status: AuthStatus.IDLE,
  } as AuthState,
  reducers: {
    logout: (state): void => {
      state.user = null;
      state.accessToken = null;
      state.isAuth = false;
    },
  },
  extraReducers: (builder): void => {
    builder
      .addCase(loginUser.pending, (state): void => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(loginUser.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuth = true;
        state.status = AuthStatus.SUCCEEDED;
      })
      .addCase(loginUser.rejected, (state, action): void => {
        state.status = AuthStatus.FAILED;
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state): void => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(registerUser.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuth = true;
        state.status = AuthStatus.SUCCEEDED;
      })
      .addCase(registerUser.rejected, (state, action): void => {
        state.status = AuthStatus.FAILED;
        state.error = action.error.message;
      })
      .addCase(refreshAuth.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuth = true;
        state.status = AuthStatus.SUCCEEDED;
      })
      .addCase(refreshAuth.rejected, (state, action): void => {
        state.user = null;
        state.accessToken = null;
        state.isAuth = false;
        state.status = AuthStatus.FAILED;
        state.error = action.error.message;
      });
  },
});

export const selectIsAuth = (state: RootState): boolean => state.auth.isAuth;
export const selectUser = (state: RootState): User | null => state.auth.user;
export const selectAccessToken = (state: RootState): string | null =>
  state.auth.accessToken;
export const selectAuthStatus = (state: RootState): AuthStatus =>
  state.auth.status;

export const { logout } = authSlice.actions;
export default authSlice.reducer;
