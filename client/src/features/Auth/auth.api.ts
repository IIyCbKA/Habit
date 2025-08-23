import { apiClient, refreshClient } from "@/api/clients";
import { ENDPOINT } from "@/api/config.enums";
import {
  EmailConfirmData,
  LoginCreds,
  CommonFulfilledResponse,
  RegisterCreds,
  PasswordResetData,
} from "./auth.types";

export async function login(
  creds: LoginCreds,
): Promise<CommonFulfilledResponse> {
  const { data } = await apiClient.post(ENDPOINT.LOGIN, creds);
  return data;
}

export async function register(
  creds: RegisterCreds,
): Promise<CommonFulfilledResponse> {
  const { data } = await apiClient.post(ENDPOINT.PENDING_REGISTER, creds);
  return data;
}

export async function emailConfirm(
  confirmData: EmailConfirmData,
): Promise<CommonFulfilledResponse> {
  const { data } = await apiClient.post(ENDPOINT.EMAIL_CONFIRM, confirmData);
  return data;
}

export async function refresh(): Promise<CommonFulfilledResponse> {
  const { data } = await refreshClient.post(ENDPOINT.REFRESH);
  return data;
}

export async function logout(): Promise<void> {
  const { data } = await apiClient.post(ENDPOINT.LOGOUT);
  return data;
}

export async function resendCode(): Promise<void> {
  await apiClient.post(ENDPOINT.VERIFY_CODE_RESEND);
}

export async function passwordReset(
  resetData: PasswordResetData,
): Promise<void> {
  const { data } = await apiClient.post(ENDPOINT.PASSWORD_RESET, resetData);
  return data;
}
