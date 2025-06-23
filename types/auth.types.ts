export type Role = "admin" | "comprador" | "ti" | "fornecedor";

export interface AuthUser {
  userId: string;
  username: string;
  roles: Role[];
  origin?: "local" | "hub";
}

export interface AuthContextData {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (username: string, senha: string) => Promise<void>;
  logout: () => void;
}
