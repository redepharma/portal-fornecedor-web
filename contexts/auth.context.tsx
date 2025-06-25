"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState, type ReactNode } from "react";

import { AuthUser, AuthContextData } from "@/types/auth.types";
import * as AuthService from "@/services/auth.service";

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

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
