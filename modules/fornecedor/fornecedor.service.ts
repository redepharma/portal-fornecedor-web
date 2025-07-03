/* eslint-disable prettier/prettier */
import { IFabricante } from "./types/fabricante.interface";

import { apiClient } from "@/modules/api/api.client";

export const FornecedorService = {
  /**
   * Lista fabricantes filtrando pelos códigos informados.
   * @param codigos Lista de códigos de fabricantes.
   * @returns Array de fabricantes encontrados.
   */
  async listarFabricantes(codigos: number[]): Promise<IFabricante[]> {
    if (codigos.length === 0) return [];

    const query = codigos.join(",");

    const response = await apiClient.get<IFabricante[]>(
      `/fornecedor?codigos=${query}`
    );

    return response.data;
  },
};
