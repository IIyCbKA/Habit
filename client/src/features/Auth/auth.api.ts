import { apiClient } from "@/api/client";
import { ENDPOINT } from "@/api/config.enums";
import {
  EmailConfirmCreds,
  LoginCreds,
  LoginResponse,
  RefreshResponse,
  RegisterCreds,
  RegisterResponse,
} from "./auth.types";

export async function login(creds: LoginCreds): Promise<LoginResponse> {
  const { data } = await apiClient.post(ENDPOINT.LOGIN, creds);
  return data;
}

export async function register(
  creds: RegisterCreds,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post(ENDPOINT.PENDING_REGISTER, creds);
  return data;
}

export async function emailConfirm(
  creds: EmailConfirmCreds,
): Promise<LoginResponse> {
  const { data } = await apiClient.post(ENDPOINT.EMAIL_CONFIRM, creds);
  return data;
}

export async function refresh(): Promise<RefreshResponse> {
  const { data } = await apiClient.post(ENDPOINT.REFRESH);
  return data;
}

export async function logout(): Promise<any> {
  const { data } = await apiClient.post(ENDPOINT.LOGOUT);
  return data;
}
