import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import { AuthUser, Role } from "@/types/auth.types";
import { apiClient } from "@/modules/api/api.client";
import { getApiBaseUrl } from "@/shared/utils";

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
let logoutCallback: (() => void) | null = null;
let refreshPromise: Promise<{
  access_token: string;
  refresh_token: string;
} | null> | null = null;

/**
 * Salva o token JWT no localStorage e em cookie.
 * @param token - Token JWT recebido após login.
 */
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  Cookies.set(TOKEN_KEY, token);
}

/**
 * Salva access e refresh tokens no localStorage e em cookie.
 */
export function setTokens(accessToken: string, refreshToken: string) {
  setToken(accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Obtém o token JWT armazenado no localStorage.
 * @returns Token JWT ou null se não existir.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Obtém o refresh token armazenado no localStorage.
 * @returns Refresh token ou null se não existir.
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Remove o token JWT do localStorage e do cookie.
 */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
}

/**
 * Decodifica o token JWT e retorna os dados do usuário.
 * @returns Dados do usuário decodificados do token ou null caso token ausente ou inválido.
 */
export function getUserFromToken(): AuthUser | null {
  const token = getToken();

  if (!token) return null;

  try {
    return jwtDecode<AuthUser>(token);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);

    return null;
  }
}

/**
 * Realiza login do usuário e armazena o token JWT.
 * @param username - Nome do usuário para login.
 * @param senha - Senha do usuário para login.
 */
export async function login(username: string, senha: string): Promise<void> {
  const response = await apiClient.post<{
    access_token: string;
    refresh_token: string;
  }>("/auth/login", {
    username,
    senha,
  });

  setTokens(response.data.access_token, response.data.refresh_token);
}

/**
 * Remove o token JWT efetivando o logout do usuário.
 */
export function logout() {
  clearToken();
}

/**
 * Obtém os dados do perfil do usuário logado a partir da API.
 * @returns Dados do usuário, incluindo array de roles.
 */
export async function getProfile(): Promise<AuthUser> {
  const response = await apiClient.get<
    Omit<AuthUser, "roles"> & { roles: string }
  >("/users/me");

  return {
    ...response.data,
    roles: response.data.roles.split(",").map((r) => r.trim()) as Role[],
  };
}

/**
 * Registra uma função para ser chamada quando ocorrer logout.
 * @param callback - Função callback para logout.
 */
export function onLogout(callback: () => void) {
  logoutCallback = callback;
}

/**
 * Dispara o callback de logout registrado para tratamento centralizado.
 */
export function triggerLogoutRedirect() {
  if (logoutCallback) logoutCallback();
}

/**
 * Renova o access token usando o refresh token armazenado.
 * @returns Novo access token ou null se falhar.
 */
export async function refreshTokens(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ access_token: string; refresh_token: string }>(
        `${getApiBaseUrl()}/auth/refresh`,
        { refresh_token: refreshToken },
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error("Erro ao renovar token:", error);

        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  const tokens = await refreshPromise;

  if (!tokens) {
    clearToken();

    return null;
  }

  setTokens(tokens.access_token, tokens.refresh_token);

  return tokens.access_token;
}
