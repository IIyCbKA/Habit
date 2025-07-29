import { apiClient, refreshClient } from "@/api/clients";
import { ENDPOINT } from "@/api/config.enums";
import {
  EmailConfirmCreds,
  LoginCreds,
  CommonFulfilledResponse,
  RegisterCreds,
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
  creds: EmailConfirmCreds,
): Promise<CommonFulfilledResponse> {
  const { data } = await apiClient.post(ENDPOINT.EMAIL_CONFIRM, creds);
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
