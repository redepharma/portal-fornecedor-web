import { IEstoque } from "./types/estoque.interface";
import { IEstoqueAgrupado } from "./types/estoqueAgrupado.interface";

import { apiClient } from "@/modules/api/api.client";

export const EstoqueService = {
  consultarEstoque: async (
    codigoInterno: string[]
  ): Promise<IEstoqueAgrupado[]> => {
    const response = await apiClient.post("/estoque/consulta-agrupado", {
      codigoInterno,
    });

    const estoqueNormalizado: IEstoqueAgrupado[] = response.data.map(
      (item: IEstoque) => ({
        cdProd: item.CD_PROD,
        cdFilial: item.CD_FILIAL,
        ean01: item.EAN ?? "",
        dsProd: item.DS_PROD,
        qtEst: item.QT_EST,
      })
    );

    return estoqueNormalizado;
  },

  consultarEstoquePorFilial: async (
    codigoInterno: string[]
  ): Promise<IEstoqueAgrupado[]> => {
    const response = await apiClient.post("/estoque/consulta-por-filial", {
      codigoInterno,
    });

    const estoqueNormalizado: IEstoqueAgrupado[] = response.data.map(
      (item: IEstoque) => ({
        cdProd: item.CD_PROD,
        cdFilial: item.CD_FILIAL,
        ean01: item.EAN ?? "",
        dsProd: item.DS_PROD,
        qtEst: item.QT_EST,
      })
    );

    return estoqueNormalizado;
  },
};
