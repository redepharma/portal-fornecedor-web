import { AxiosError } from "axios";

import { FalhaStatusPedido } from "./pedidos-api.types";

import { apiPedidosClient } from "@/modules/api/api-pedidos.client";
import { IStatusPedidoMultigiro } from "@/modules/compras/status-pedido/types/status-pedido.interface";

type RespostaStatus = {
  ok: IStatusPedidoMultigiro[];
  falhas: FalhaStatusPedido[];
};

type ListarResultado = RespostaStatus & { httpStatus: number };
type ListarOpts = { signal?: AbortSignal };

function parseAxiosError(err: unknown, fallback: string): Error {
  const axErr = err as AxiosError<any>;

  if (axErr?.response?.data) {
    const data = axErr.response.data;
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
  async listarStatusPedidos(opts?: ListarOpts): Promise<ListarResultado> {
    try {
      const res = await apiPedidosClient.get<RespostaStatus>(
        "/multigiro/status-pedidos",
        {
          signal: opts?.signal,
          validateStatus: (s) =>
            s === 204 || s === 206 || s === 502 || (s >= 200 && s < 300),
        },
      );

      if (res.status === 204) {
        return { ok: [], falhas: [], httpStatus: 204 };
      }

      const payload = res.data ?? { ok: [], falhas: [] };

      return {
        ok: Array.isArray(payload.ok) ? payload.ok : [],
        falhas: Array.isArray(payload.falhas) ? payload.falhas : [],
        httpStatus: res.status,
      };
    } catch (err) {
      const axErr = err as AxiosError;

      if (axErr?.response?.status === 404) {
        try {
          const res2 = await apiPedidosClient.get<RespostaStatus>(
            "/multigiro/status-pedido",
            {
              signal: opts?.signal,
              validateStatus: (s) =>
                s === 204 || s === 206 || s === 502 || (s >= 200 && s < 300),
            },
          );

          if (res2.status === 204) {
            return { ok: [], falhas: [], httpStatus: 204 };
          }

          const payload2 = res2.data ?? { ok: [], falhas: [] };

          return {
            ok: Array.isArray(payload2.ok) ? payload2.ok : [],
            falhas: Array.isArray(payload2.falhas) ? payload2.falhas : [],
            httpStatus: res2.status,
          };
        } catch (err2) {
          throw parseAxiosError(
            err2,
            "Não foi possível consultar o status dos pedidos (rota singular).",
          );
        }
      }
      throw parseAxiosError(
        err,
        "Não foi possível consultar o status dos pedidos.",
      );
    }
  },
};
