import { apiClient, refreshClient } from "@/api/clients";
import { ENDPOINT } from "@/api/config.enums";
import {
  EmailConfirmData,
  LoginCreds,
  CommonFulfilledResponse,
  RegisterCreds,
  PasswordResetRequestData,
  PasswordResetValidateData,
  PasswordResetConfirmData,
  UsernameUpdateData,
  UsernameUpdateResponse,
} from "./types";

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

export async function passwordResetRequest(
  resetData: PasswordResetRequestData,
): Promise<void> {
  const { data } = await apiClient.post(
    ENDPOINT.PASSWORD_RESET_REQUEST,
    resetData,
  );
  return data;
}

export async function passwordResetValidate(
  validateData: PasswordResetValidateData,
): Promise<void> {
  await apiClient.post(ENDPOINT.PASSWORD_RESET_VALIDATE, validateData);
}

export async function passwordResetConfirm(
  confirmData: PasswordResetConfirmData,
): Promise<CommonFulfilledResponse> {
  const { data } = await apiClient.post(
    ENDPOINT.PASSWORD_RESET_CONFIRM,
    confirmData,
  );
  return data;
}

export async function usernameUpdate(
  updateData: UsernameUpdateData,
): Promise<UsernameUpdateResponse> {
  const { data } = await apiClient.post(ENDPOINT.USERNAME_UPDATE, updateData);
  return data;
}
