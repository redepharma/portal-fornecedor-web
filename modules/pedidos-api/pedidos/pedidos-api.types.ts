export interface IEnviarPedidoMultigiroPayload {
  codigoFornecedor: number;
  codigoPedido: number;
  codigoLoja: number;
  pedidoDeFraldas: boolean;
}

export type FalhaStatusPedido = {
  seqPedido: string;
  fornecedor: number;
  statusHttp?: number;
  message: string;
};
