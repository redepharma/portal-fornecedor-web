/**
 * Interface que representa um usuário do sistema.
 */
export interface IUsuario {
  id: number;
  nome: string;
  username: string;
  codigoInterno?: string;
  roles: string;
}
