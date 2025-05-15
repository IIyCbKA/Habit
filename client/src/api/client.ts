import axios, { AxiosInstance } from "axios";

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.DJANGO_HOST_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
