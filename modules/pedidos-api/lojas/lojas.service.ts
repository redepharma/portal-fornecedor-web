import { AxiosError } from "axios";

import { ILoja, ILojaBackend } from "./loja.types";

import { apiPedidosClient } from "@/modules/api/api-pedidos.client";

type BuscarLojasOpts = {
  signal?: AbortSignal;
};

export const LojasService = {
  /**
   * Busca lojas do backend e mapeia para o formato do Select.
   */
  async buscarLojasPedidos(opts?: BuscarLojasOpts): Promise<ILoja[]> {
    try {
      const res = await apiPedidosClient.get<ILojaBackend[]>("/lojas", {
        signal: opts?.signal,
      });

      const data = Array.isArray(res.data) ? res.data : [];

      return data.map((l) => ({
        id: String((l as any).id),
        nome: (l as any).nome_filial,
        codigo: Number((l as any).numero_filial),
      }));
    } catch (err) {
      const axErr = err as AxiosError<{ message?: string }>;

      let msg = "Não foi possível carregar as lojas.";

      if (axErr.response?.data?.message) {
        msg = axErr.response.data.message;
      } else if (axErr.message) {
        msg = `${msg} Detalhes: ${axErr.message}`;
      }
      throw new Error(msg);
    }
  },
};
