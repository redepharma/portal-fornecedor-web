import { AxiosError } from "axios";

import { apiPedidosClient } from "@/modules/api/api-pedidos.client";

/**
 * Payload do frontend (espelha o DTO do backend)
 *   ValidarPedidoRequisicaoDTO
 */
export interface EnviarPedidoDTO {
  codigoFornecedor: number;
  codigoLoja: number;
  codigoPedido: number;
  pedidoDeFraldas: boolean;
}

/**
 * Estruturas de resposta possíveis do backend
 * /multigiro/enviar
 *  - 201: sucesso (estrutura vem da API Multigiro → manteremos como unknown)
 *  - 206: sucesso parcial (backend já define este shape)
 */
export type EnvioParcial = {
  statusCode: 206;
  message: string;
  produtosNaoEncontrados: unknown[];
  itensEnviaveis: unknown[];
};

// 201 Created (formato vindo da Multigiro) — manter como unknown
export type EnvioSucesso = unknown;

// União de respostas do /enviar
export type EnviarPedidoResposta = EnvioParcial | EnvioSucesso;

/**
 * /multigiro/enviar-teste
 *  - retorna um array com o registro inserido (mantemos como unknown[]).
 */
export type EnviarPedidoTesteResposta = unknown[];

type EnviarOpts = {
  signal?: AbortSignal;
};

function isEnvioParcial(resp: any): resp is EnvioParcial {
  return resp && typeof resp === "object" && resp.statusCode === 206;
}

function parseAxiosError(err: unknown, fallback: string): Error {
  const axErr = err as AxiosError<{ message?: string }>;

  if (axErr?.response?.data) {
    // o backend pode repassar JSON da API externa; preservamos se houver
    const data = axErr.response.data as any;

    if (typeof data === "object") {
      // se houver "message" usa; senão serializa o JSON
      const msg =
        data.message ??
        (axErr.response.status
          ? `Erro ${axErr.response.status}: ${JSON.stringify(data)}`
          : JSON.stringify(data));

      return new Error(msg);
    }
  }
  if (axErr?.message)
    return new Error(`${fallback} Detalhes: ${axErr.message}`);

  return new Error(fallback);
}

export const PedidosEnvioService = {
  /**
   * Envia pedido para o endpoint /multigiro/enviar
   * - Trata 201 (sucesso) e 206 (sucesso parcial) sem lançar erro
   * - Lança Error para demais status
   */
  async enviar(
    payload: EnviarPedidoDTO,
    opts?: EnviarOpts
  ): Promise<EnviarPedidoResposta> {
    try {
      const res = await apiPedidosClient.post<EnviarPedidoResposta>(
        "/multigiro/enviar",
        payload,
        {
          signal: opts?.signal,
          // aceitar 206 como "ok" (não cair no catch do Axios)
          validateStatus: (s) => (s >= 200 && s < 300) || s === 206,
        }
      );

      // Se vier 206, devolve como tal; caso contrário, devolve o body (201)
      return res.data;
    } catch (err) {
      throw parseAxiosError(err, "Não foi possível enviar o pedido.");
    }
  },

  /**
   * Envia para o endpoint /multigiro/enviar-teste
   * - Retorna o array inserido pelo backend (mantido como unknown[])
   */
  async enviarTeste(
    payload: EnviarPedidoDTO,
    opts?: EnviarOpts
  ): Promise<EnviarPedidoTesteResposta> {
    try {
      const res = await apiPedidosClient.post<EnviarPedidoTesteResposta>(
        "/multigiro/enviar-teste",
        payload,
        { signal: opts?.signal }
      );

      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      throw parseAxiosError(
        err,
        "Não foi possível enviar o pedido (modo teste)."
      );
    }
  },
};
