import axios from "axios";

import { getToken, triggerLogoutRedirect } from "@/services/auth.service";

/**
 * Instância do cliente HTTP Axios configurada para comunicação com a API.
 *
 * Aplica baseURL dinâmica, timeout e interceptadores para incluir token
 * e tratar respostas 401 com logout automático.
 */
export const apiPedidosClient = axios.create({
  baseURL: "http://localhost:3002",
  timeout: 3000000,
});

// Interceptor para adicionar token Bearer e headers apropriados nas requisições
apiPedidosClient.interceptors.request.use((config) => {
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
apiPedidosClient.interceptors.response.use(
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
