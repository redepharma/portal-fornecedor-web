import { apiClient } from "../api/api.client";

import { ConsultaVendaDTO } from "./types/consultaVenda.dto";
import { IVendaComEAN } from "./types/vendaComEan.interface";

export const VendaService = {
  async consultarVendas(dto: ConsultaVendaDTO): Promise<IVendaComEAN[]> {
    const response = await apiClient.post("/venda/consulta", dto);

    return response.data;
  },
};
