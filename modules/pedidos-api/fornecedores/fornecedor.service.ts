import { AxiosError } from "axios";

import { IFornecedorPedido } from "./fornecedor-pedido.interface";

import { apiPedidosClient } from "@/modules/api/api-pedidos.client";

export const FornecedorPedidosService = {
  async buscarFornecedoresPedidos(opts?: {
    signal?: AbortSignal;
  }): Promise<IFornecedorPedido[]> {
    try {
      const res = await apiPedidosClient.get<IFornecedorPedido[]>(
        "/fornecedores",
        { signal: opts?.signal }
      );

      const data = Array.isArray(res.data) ? res.data : [];

      return data;
    } catch (err) {
      const axErr = err as AxiosError<{ message?: string }>;
      let msg = "Não foi possível carregar os fornecedores.";

      if (axErr.response?.data?.message) {
        msg = axErr.response.data.message;
      } else if (axErr.message) {
        msg = `${msg} Detalhes: ${axErr.message}`;
      }
      throw new Error(msg);
    }
  },
};
