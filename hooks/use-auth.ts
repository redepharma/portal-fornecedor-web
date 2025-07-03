import { useContext } from "react";

import { AuthContext } from "@/contexts/auth.context";

/**
 * Hook customizado para acessar o contexto de autenticação.
 *
 * @throws {Error} Se usado fora do AuthProvider.
 * @returns {AuthContextData} Contexto com usuário, status e funções de login/logout.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }

  return context;
};
