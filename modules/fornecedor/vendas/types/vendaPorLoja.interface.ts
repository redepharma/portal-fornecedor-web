/**
 * Interface que representa venda agrupada por filial e produto.
 */
export interface IVendaPorFilial {
  CD_FILIAL: number;
  CD_PROD: number;
  DS_PROD: string;
  EAN: string | null;
  QT_IT: number;
  VLR_LIQ_VD: number;
  VLR_VD: number;
}
