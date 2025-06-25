"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Button,
} from "@heroui/react";

import { IVendaComEAN } from "@/modules/vendas/types/vendaComEan.interface";

interface TabelaVendasProps {
  vendas: IVendaComEAN[];
  pagina: number;
  porPagina: number;
  setPagina: (page: number) => void;
  loading: boolean;
}

export function TabelaVendasPorProduto({
  vendas,
  pagina,
  porPagina,
  setPagina,
  loading,
}: TabelaVendasProps) {
  const totalPaginas = Math.ceil(vendas.length / porPagina);

  const vendasPaginadas = vendas.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  return (
    <>
      <div className="flex flex-row-reverse justify-between items-center mb-2">
        <Button color="primary" size="sm">
          Baixar Excel
        </Button>
      </div>
      <Table
        isHeaderSticky
        isStriped
        className="max-h-[450px]"
        maxTableHeight={450}
        shadow="sm"
      >
        <TableHeader>
          <TableColumn>Código</TableColumn>
          <TableColumn>EAN</TableColumn>
          <TableColumn>Descrição</TableColumn>
          <TableColumn>Quantidade</TableColumn>
          <TableColumn>Valor Líquido</TableColumn>
          <TableColumn>Valor Total</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={loading ? <Spinner /> : "Sem resultados"}
          items={vendasPaginadas.map((item, index) => ({
            ...item,
            __key: `${item.CD_PROD}-${item.EAN ?? "sem-ean"}-${index}`,
          }))}
        >
          {(item) => (
            <TableRow key={item.__key}>
              <TableCell>{item.CD_PROD}</TableCell>
              <TableCell>{item.EAN ?? "-"}</TableCell>
              <TableCell>{item.DS_PROD}</TableCell>
              <TableCell>{item.QT_IT}</TableCell>
              <TableCell>{item.VLR_LIQ_VD.toFixed(2)}</TableCell>
              <TableCell>{item.VLR_VD.toFixed(2)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPaginas > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination page={pagina} total={totalPaginas} onChange={setPagina} />
        </div>
      )}
    </>
  );
}
