import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login as loginAPI, register as registerAPI } from "./auth.api";
import { clearToken, setToken } from "@/api/TokenService/tokenService";
import {
  AuthState,
  LoginCreds,
  LoginResponse,
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

const authSlice = createSlice({
  name: SLISE_NAME,
  initialState: {
    user: null,
    isAuth: false,
    status: AuthStatus.IDLE,
  } as AuthState,
  reducers: {
    logout: (state): void => {
      state.user = null;
      state.isAuth = false;
      clearToken();
    },
  },
  extraReducers: (builder): void => {
    builder
      .addCase(loginUser.pending, (state): void => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(loginUser.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.isAuth = true;
        state.status = AuthStatus.SUCCEEDED;
        setToken(action.payload.token);
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
        state.isAuth = true;
        state.status = AuthStatus.SUCCEEDED;
        setToken(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action): void => {
        state.status = AuthStatus.FAILED;
        state.error = action.error.message;
      });
  },
});

export const selectIsAuth = (state: RootState): boolean => state.auth.isAuth;
export const selectUser = (state: RootState): User | null => state.auth.user;

export const { logout } = authSlice.actions;
export default authSlice.reducer;
