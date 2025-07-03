import { CriarUsuarioDto } from "./criarUsuario.dto";

/**
 * DTO para atualização parcial dos dados do usuário.
 *
 * Extende todos os campos de CriarUsuarioDto como opcionais.
 */
export interface UpdateUsuarioDto extends Partial<CriarUsuarioDto> {}
