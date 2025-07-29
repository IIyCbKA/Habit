import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/Auth/auth.slice";
import uiReduced from "@/features/uiState/uiState.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReduced,
});
