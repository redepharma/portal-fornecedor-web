import { apiClient } from "../../api/api.client";

import { CriarUsuarioDto } from "./types/criarUsuario.dto";
import { UpdateUsuarioDto } from "./types/updateUsuario.dto";
import { IUsuario } from "./types/usuario.interface";

/**
 * Lista todos os usuários cadastrados.
 *
 * @returns {Promise<IUsuario[]>} Promise com array de usuários.
 */
export const listarUsuarios = async (): Promise<IUsuario[]> => {
  const { data } = await apiClient.get("/users");

  return data;
};

/**
 * Cria um novo usuário.
 *
 * @param {CriarUsuarioDto} usuario - Dados para criação do usuário.
 * @returns {Promise<IUsuario>} Promise com o usuário criado.
 */
export const criarUsuario = async (
  usuario: CriarUsuarioDto,
): Promise<IUsuario> => {
  const { data } = await apiClient.post("/users", usuario);

  return data;
};

/**
 * Atualiza um usuário existente parcialmente.
 *
 * @param {number} id - ID do usuário a ser atualizado.
 * @param {UpdateUsuarioDto} usuario - Dados para atualização.
 * @returns {Promise<IUsuario>} Promise com o usuário atualizado.
 */
export const atualizarUsuario = async (
  id: number,
  usuario: UpdateUsuarioDto,
): Promise<IUsuario> => {
  const { data } = await apiClient.patch(`/users/${id}`, usuario);

  return data;
};

/**
 * Altera a senha de um usuário.
 *
 * @param {number} id - ID do usuário.
 * @param {string} senha - Nova senha.
 * @returns {Promise<IUsuario>} Promise com o usuário atualizado.
 */
export const alterarSenhaUsuario = async (
  id: number,
  senha: string,
): Promise<IUsuario> => {
  const { data } = await apiClient.patch(`/users/${id}/senha`, { senha });

  return data;
};

/**
 * Remove um usuário pelo ID.
 *
 * @param {number} id - ID do usuário a ser removido.
 * @returns {Promise<void>} Promise resolvida após exclusão.
 */
export const removerUsuario = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
