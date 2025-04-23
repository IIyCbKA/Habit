import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/config";
import { LoginCreds, RegisterCreds } from "./auth.types";

export async function login(creds: LoginCreds): Promise<any> {
  const { data } = await apiClient.post(ENDPOINTS.LOGIN, creds);
  return data;
}

export async function register(creds: RegisterCreds): Promise<any> {
  const { data } = await apiClient.post(ENDPOINTS.REGISTER, creds);
  return data;
}
