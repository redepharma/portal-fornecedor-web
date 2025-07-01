import { apiClient } from "../../api/api.client";

import { CriarUsuarioDto } from "./types/criarUsuario.dto";
import { UpdateUsuarioDto } from "./types/updateUsuario.dto";
import { IUsuario } from "./types/usuario.interface";

export const listarUsuarios = async (): Promise<IUsuario[]> => {
  const { data } = await apiClient.get("/users");

  return data;
};

export const criarUsuario = async (
  usuario: CriarUsuarioDto
): Promise<IUsuario> => {
  const { data } = await apiClient.post("/users", usuario);

  return data;
};

export const atualizarUsuario = async (
  id: number,
  usuario: UpdateUsuarioDto
): Promise<IUsuario> => {
  const { data } = await apiClient.patch(`/users/${id}`, usuario);

  return data;
};

export const removerUsuario = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
