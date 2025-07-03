import { apiClient } from "../../api/api.client";

import { ConsultaVendaDTO } from "./types/consultaVenda.dto";
import { IVendaComEAN } from "./types/vendaComEan.interface";
import { IVendaPorFilial } from "./types/vendaPorLoja.interface";

export const VendaService = {
  /**
   * Consulta vendas agrupadas por produto.
   * @param dto Dados para filtro da consulta.
   * @returns Lista de vendas com EAN.
   */
  async consultarVendas(dto: ConsultaVendaDTO): Promise<IVendaComEAN[]> {
    const response = await apiClient.post("/venda/consulta-agrupado", dto);

    return response.data.map((item: IVendaComEAN) => ({
      ...item,
      VLR_LIQ_VD: Number(item.VLR_LIQ_VD.toFixed(2)),
      VLR_VD: Number(item.VLR_VD.toFixed(2)),
    }));
  },

  /**
   * Consulta vendas agrupadas por filial e produto.
   * @param dto Dados para filtro da consulta.
   * @returns Lista de vendas agrupadas por filial.
   */
  async consultarVendasPorLoja(dto: ConsultaVendaDTO): Promise<IVendaPorFilial[]> {
    const response = await apiClient.post("/venda/consulta-por-filial", dto);

    return response.data.map((item: IVendaPorFilial) => ({
      ...item,
      VLR_LIQ_VD: Number(item.VLR_LIQ_VD.toFixed(2)),
      VLR_VD: Number(item.VLR_VD.toFixed(2)),
    }));
  },

  /**
   * Exporta as vendas agrupadas por produto para Excel.
   * @param dto Dados para filtro da exportação.
   */
  async exportarVendasExcel(dto: ConsultaVendaDTO): Promise<void> {
    const url = `/venda/exportar-excel?codigoFabricante=${dto.codigoFabricante}&dataInicio=${dto.dataInicio}&dataFim=${dto.dataFim}`;

    const response = await apiClient.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const urlBlob = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = urlBlob;
    link.download = "vendas_agrupadas.xlsx";
    link.click();

    window.URL.revokeObjectURL(urlBlob);
  },

  /**
   * Exporta as vendas agrupadas por filial para Excel.
   * @param dto Dados para filtro da exportação.
   */
  async exportarVendasPorFilialExcel(dto: ConsultaVendaDTO): Promise<void> {
    const url = `/venda/exportar-excel-por-filial?codigoFabricante=${dto.codigoFabricante}&dataInicio=${dto.dataInicio}&dataFim=${dto.dataFim}`;

    const response = await apiClient.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const urlBlob = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = urlBlob;
    link.download = "vendas_por_filial.xlsx";
    link.click();

    window.URL.revokeObjectURL(urlBlob);
  },
};
