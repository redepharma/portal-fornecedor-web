/**
 * Interface que representa o estoque agrupado por produto e filial.
 */
export interface IEstoqueAgrupado {
  cdProd: number;
  cdFilial: number;
  ean01: string;
  dsProd: string;
  qtEst: number;
}
