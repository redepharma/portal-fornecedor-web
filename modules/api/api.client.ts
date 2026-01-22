import axios from "axios";

import {
  getToken,
  refreshTokens,
  triggerLogoutRedirect,
} from "@/services/auth.service";
import { getApiBaseUrl } from "@/shared/utils";

/**
 * Instância do cliente HTTP Axios configurada para comunicação com a API.
 *
 * Aplica baseURL dinâmica, timeout e interceptadores para incluir token
 * e tratar respostas 401 com logout automático.
 */
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 3000000,
});

// Interceptor para adicionar token Bearer e headers apropriados nas requisições
apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  const isFormData = config.data instanceof FormData;

  if (!isFormData && config.data) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Interceptor para tratar respostas, disparando logout se status 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshTokens();

      if (newToken && originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      }

      console.warn("[apiClient] 401 detectado → refresh falhou.");
      triggerLogoutRedirect();
    }

    return Promise.reject(error);
  },
);
