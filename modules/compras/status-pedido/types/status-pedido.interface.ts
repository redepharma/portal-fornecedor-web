export interface IStatusPedidoMultigiro {
  seqPedido: number;
  seqCanalVenda: number;
  idPedidoCanalVenda: string;
  nroEmpresa: number;
  statusIntegracao: string;
  nroPedVenda: number;
  _expandables: string[] | number[] | null;
}
