import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import { AuthUser, Role } from "@/types/auth.types";
import { apiClient } from "@/modules/api/api.client";

const TOKEN_KEY = "access_token";
let logoutCallback: (() => void) | null = null;

/**
 * Salva o token JWT no localStorage e em cookie.
 * @param token - Token JWT recebido após login.
 */
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  Cookies.set(TOKEN_KEY, token);
}

/**
 * Obtém o token JWT armazenado no localStorage.
 * @returns Token JWT ou null se não existir.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove o token JWT do localStorage e do cookie.
 */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  Cookies.remove(TOKEN_KEY);
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
  const response = await apiClient.post<{ access_token: string }>(
    "/auth/login",
    {
      username,
      senha,
    }
  );

  setToken(response.data.access_token);
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
