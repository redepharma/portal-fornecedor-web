"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState, type ReactNode } from "react";

import { AuthUser, AuthContextData } from "@/types/auth.types";
import * as AuthService from "@/services/auth.service";

/**
 * Contexto React para informações e ações de autenticação.
 *
 * Fornece estado do usuário, status da autenticação e métodos para login/logout.
 */
export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

/**
 * Provedor de contexto para autenticação do usuário.
 *
 * Inicializa estado do usuário, escuta logout forçado pela API,
 * gerencia login, logout e perfil do usuário.
 *
 * @param {{ children: ReactNode }} props - Conteúdo filho que receberá o contexto.
 * @returns {JSX.Element} Provedor de contexto de autenticação.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthContextData["status"]>("loading");
  const router = useRouter();

  useEffect(() => {
    // Listener para quando apiClient detectar 401
    AuthService.onLogout(() => {
      logout();
      router.push("/login");
    });

    const token = AuthService.getToken();

    if (!token) {
      setStatus("unauthenticated");

      return;
    }

    AuthService.getProfile()
      .then(setUser)
      .then(() => setStatus("authenticated"))
      .catch(() => {
        setUser(null);
        setStatus("unauthenticated");
      });
  }, []);

  const login = async (username: string, senha: string) => {
    await AuthService.login(username, senha);
    const profile = await AuthService.getProfile();

    setUser(profile);
    setStatus("authenticated");
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
