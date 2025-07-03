/**
 * DTO para criação de usuário.
 */
export interface CriarUsuarioDto {
  nome: string;
  senha: string;
  username: string;
  codigoInterno?: string;
  roles: string;
}
