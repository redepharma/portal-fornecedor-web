import { addToast } from "@heroui/react";

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

  async exportarExcelEstoquePorFilial(codigosInternos: string[]) {
    const query = codigosInternos.join(",");

    try {
      const response = await apiClient.get(
        `/estoque/exportar-excel-por-filial`,
        {
          params: { codigoInterno: query },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "estoque_por_filial.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      if (error.response?.status === 404) {
        const mensagem =
          error.response.data?.mensagem ||
          "Nenhum estoque encontrado para exportação.";

        addToast({
          title: "Não foi possível exportar",
          description: mensagem,
          color: "warning",
        });
      } else {
        const mensagem =
          error?.response?.data?.mensagem || "Erro ao exportar estoque.";

        addToast({
          title: "Erro ao exportar",
          description: mensagem,
          color: "danger",
        });
      }
    }
  },
};
