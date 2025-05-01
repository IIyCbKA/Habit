import { apiClient } from "@/api/client";
import { ENDPOINT } from "@/api/config.enums";
import { LoginCreds, RegisterCreds } from "./auth.types";

export async function login(creds: LoginCreds): Promise<any> {
  const { data } = await apiClient.post(ENDPOINT.LOGIN, creds);
  return data;
}

export async function register(creds: RegisterCreds): Promise<any> {
  const { data } = await apiClient.post(ENDPOINT.REGISTER, creds);
  return data;
}

export async function refresh(): Promise<any> {
  const { data } = await apiClient.post(ENDPOINT.REFRESH);
  return { data };
}
