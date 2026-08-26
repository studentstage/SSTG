import axios from "axios";
import { env } from "../../config/env";
import { normalizeApiError } from "../../lib/api-error";

const normalizedBaseUrl = env.apiUrl.replace(/\/+$/, "");
const baseURL = normalizedBaseUrl.endsWith("/api")
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(normalizeApiError(error));
  },
);

export { baseURL };
