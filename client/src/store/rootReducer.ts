import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/Auth/slice";
import uiReduced from "@/features/uiState/slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReduced,
});
