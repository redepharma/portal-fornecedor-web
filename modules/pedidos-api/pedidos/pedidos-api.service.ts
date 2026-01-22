import { AxiosError } from "axios";

import { IEnviarPedidoMultigiroPayload } from "./pedidos-api.types";
import {
  EnviarPedidoDTO,
  EnviarPedidoResposta,
} from "./enviar-pedidos.service";

import { apiPedidosClient } from "@/modules/api/api-pedidos.client";

type EnviarPedidoOpts = {
  signal?: AbortSignal;
};

export const PedidosService = {
  async enviarPedidoMultigiro(
    payload: IEnviarPedidoMultigiroPayload,
    opts?: EnviarPedidoOpts,
  ): Promise<EnviarPedidoResposta> {
    try {
      const res = await apiPedidosClient.post<EnviarPedidoDTO>(
        "/multigiro/enviar",
        payload,
        {
          signal: opts?.signal,
        },
      );

      return res.data;
    } catch (err) {
      const axErr = err as AxiosError<{ message?: string }>;
      let msg = "Não foi possível enviar o pedido multigiro.";

      if (axErr.response?.data?.message) {
        msg = axErr.response.data.message;
      } else if (axErr.message) {
        msg = `${msg} Detalhes: ${axErr.message}`;
      }
      throw new Error(msg);
    }
  },
};
