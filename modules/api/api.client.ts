import axios from "axios";

import { getToken, triggerLogoutRedirect } from "@/services/auth.service";
import { getApiBaseUrl } from "@/shared/utils";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 60000,
});

// Token automático
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

// Redirecionamento centralizado
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("[apiClient] 401 detectado → disparando logout.");
      triggerLogoutRedirect(); // <- redirecionamento via AuthProvider
    }

    return Promise.reject(error);
  }
);
