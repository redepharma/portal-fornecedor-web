/**
 * Tipos de papéis que um usuário pode ter no sistema.
 */
export type Role = "admin" | "comprador" | "ti" | "fornecedor";

/**
 * Representa os dados do usuário autenticado.
 */
export interface AuthUser {
  id: number;
  nome: string;
  username: string;
  codigoInterno: string;
  roles: Role[];
  origin?: "local" | "hub";
}

/**
 * Dados e métodos expostos pelo contexto de autenticação.
 */
export interface AuthContextData {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (username: string, senha: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}
