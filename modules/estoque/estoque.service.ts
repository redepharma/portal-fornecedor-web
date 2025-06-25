import { IEstoque } from "./types/estoque.interface";

import { apiClient } from "@/modules/api/api.client";

export const EstoqueService = {
  consultarEstoque: async (codigoInterno: string[]): Promise<IEstoque[]> => {
    const response = await apiClient.post<IEstoque[]>("/estoque/consulta", {
      codigoInterno,
    });

    return response.data;
  },
};
