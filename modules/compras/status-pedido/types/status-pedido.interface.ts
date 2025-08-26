export interface IStatusPedidoMultigiro {
  seqPedido: number;
  seqCanalVenda: number;
  idPedidoCanalVenda: string;
  nroEmpresa: number;
  statusIntegracao: string;
  nroPedVenda: number;
  codigoPedido: number | null;
  codigoFornecedor: number | null;
  _expandables: string[] | number[] | null;
}
