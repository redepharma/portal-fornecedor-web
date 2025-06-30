import { apiClient } from "../api/api.client";

import { ConsultaVendaDTO } from "./types/consultaVenda.dto";
import { IVendaComEAN } from "./types/vendaComEan.interface";
import { IVendaPorFilial } from "./types/vendaPorLoja.interface";

export const VendaService = {
  async consultarVendas(dto: ConsultaVendaDTO): Promise<IVendaComEAN[]> {
    const response = await apiClient.post("/venda/consulta-agrupado", dto);

    return response.data.map((item: IVendaComEAN) => ({
      ...item,
      VLR_LIQ_VD: Number(item.VLR_LIQ_VD.toFixed(2)),
      VLR_VD: Number(item.VLR_VD.toFixed(2)),
    }));
  },

  async consultarVendasPorLoja(
    dto: ConsultaVendaDTO
  ): Promise<IVendaPorFilial[]> {
    const response = await apiClient.post("/venda/consulta-por-filial", dto);

    return response.data.map((item: IVendaPorFilial) => ({
      ...item,
      VLR_LIQ_VD: Number(item.VLR_LIQ_VD.toFixed(2)),
      VLR_VD: Number(item.VLR_VD.toFixed(2)),
    }));
  },
};
