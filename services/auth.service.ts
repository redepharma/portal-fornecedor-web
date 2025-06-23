import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import { AuthUser } from "@/types/auth.types";
import { apiClient } from "@/modules/api/api.client";

const TOKEN_KEY = "access_token";
let logoutCallback: (() => void) | null = null;

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  Cookies.set(TOKEN_KEY, token); // Também salva nos cookies
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  Cookies.remove(TOKEN_KEY);
}

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

export function logout() {
  clearToken();
}

export async function getProfile(): Promise<AuthUser> {
  const response = await apiClient.get<AuthUser>("/users/me");

  return response.data;
}

export function onLogout(callback: () => void) {
  logoutCallback = callback;
}

export function triggerLogoutRedirect() {
  if (logoutCallback) logoutCallback();
}
