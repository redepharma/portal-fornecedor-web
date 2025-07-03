/**
 * DTO para consulta de vendas com filtros por fabricante e período.
 */
export interface ConsultaVendaDTO {
  codigoFabricante: string;
  dataInicio: string;
  dataFim: string;
}
