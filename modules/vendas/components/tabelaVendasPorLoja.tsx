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

interface Props {
  vendas: IVendaComEAN[];
  pagina: number;
  porPagina: number;
  setPagina: (p: number) => void;
  loading: boolean;
}

export function TabelaVendasPorLoja({
  vendas,
  pagina,
  porPagina,
  setPagina,
  loading,
}: Props) {
  const totalPaginas = Math.ceil(vendas.length / porPagina);

  const vendasPaginadas = vendas
    .slice((pagina - 1) * porPagina, pagina * porPagina)
    .map((item, index) => ({
      ...item,
      __key: `${item.CD_PROD}-${item.EAN ?? "sem-ean"}-${item.CD_FILIAL ?? "sem-filial"}-${index}`,
    }));

  const totalLiquido = vendas.reduce(
    (soma, v) => soma + (v.VLR_LIQ_VD || 0),
    0
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        {" "}
        <p className="text-sm text-gray-600 font-medium mb-2">
          O total de vendas líquidas no período:{" "}
          <strong>R${totalLiquido.toFixed(2)}</strong>
        </p>
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
          <TableColumn>Filial</TableColumn>
          <TableColumn>Código</TableColumn>
          <TableColumn>EAN</TableColumn>
          <TableColumn>Descricao</TableColumn>
          <TableColumn>Quantidade</TableColumn>
          <TableColumn>Valor Liquido</TableColumn>
          <TableColumn>Valor Total</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={loading ? <Spinner /> : "Sem resultados"}
          items={vendasPaginadas}
        >
          {(item) => (
            <TableRow key={item.__key}>
              <TableCell>{item.CD_FILIAL ?? "-"}</TableCell>
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
    </div>
  );
}
