import axios, { AxiosInstance } from "axios";
import { API_BASE } from "@/shared/constants";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const refreshClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});
