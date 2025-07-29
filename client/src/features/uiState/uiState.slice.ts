import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_NAME } from "./uiState.constants";
import { UiState } from "./uiState.types";
import { Form } from "./uiState.types";
import {
  loginUser,
  logout,
  refreshAuth,
  registerUser,
} from "@/features/Auth/auth.slice";
import { RootState } from "@/store/store";

const uiSlice = createSlice({
  name: SLICE_NAME,
  initialState: {
    authForm: "signIn",
  } as UiState,
  reducers: {
    setAuthForm(state, action: PayloadAction<Form>): void {
      state.authForm = action.payload;
    },
  },
  extraReducers: (builder): void => {
    builder
      .addCase(registerUser.fulfilled, (state): void => {
        state.authForm = "confirmEmail";
      })
      .addCase(loginUser.fulfilled, (state, action): void => {
        state.authForm = action.payload.user.isEmailVerified
          ? "signIn"
          : "confirmEmail";
      })
      .addCase(refreshAuth.rejected, (state) => {
        state.authForm = "signIn";
      })
      .addCase(logout.fulfilled, (state) => {
        state.authForm = "signIn";
      });
  },
});

export const { setAuthForm } = uiSlice.actions;
export const selectAuthForm = (state: RootState) => state.ui.authForm;

export default uiSlice.reducer;
