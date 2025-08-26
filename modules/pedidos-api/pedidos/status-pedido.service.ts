import { AxiosError } from "axios";

import { apiPedidosClient } from "@/modules/api/api-pedidos.client";
import { IStatusPedidoMultigiro } from "@/modules/compras/status-pedido/types/status-pedido.interface";

type ListarOpts = { signal?: AbortSignal };

function parseAxiosError(err: unknown, fallback: string): Error {
  const axErr = err as AxiosError<{ message?: string }>;

  if (axErr?.response?.data) {
    const data = axErr.response.data as any;
    const msg =
      (typeof data === "object" && data?.message) ??
      (axErr.response.status
        ? `Erro ${axErr.response.status}: ${JSON.stringify(data)}`
        : JSON.stringify(data));

    return new Error(msg || fallback);
  }
  if (axErr?.message)
    return new Error(`${fallback} Detalhes: ${axErr.message}`);

  return new Error(fallback);
}

/** Serviço p/ consultar status dos pedidos na Multigiro */
export const MultigiroStatusService = {
  /**
   * Busca os status pendentes no backend.
   * - Tenta `/multigiro/status-pedidos` (plural)
   * - Se 404, tenta `/multigiro/status-pedido` (singular) como fallback
   */
  async listar(opts?: ListarOpts): Promise<IStatusPedidoMultigiro[]> {
    try {
      const res = await apiPedidosClient.get<IStatusPedidoMultigiro[]>(
        "/multigiro/status-pedidos",
        { signal: opts?.signal }
      );

      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      // fallback automático se a rota plural não existir ainda
      const axErr = err as AxiosError;

      if (axErr?.response?.status === 404) {
        try {
          const res2 = await apiPedidosClient.get<IStatusPedidoMultigiro[]>(
            "/multigiro/status-pedido",
            { signal: opts?.signal }
          );

          return Array.isArray(res2.data) ? res2.data : [];
        } catch (err2) {
          throw parseAxiosError(
            err2,
            "Não foi possível consultar o status dos pedidos (rota singular)."
          );
        }
      }
      throw parseAxiosError(
        err,
        "Não foi possível consultar o status dos pedidos."
      );
    }
  },
};
