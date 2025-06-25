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
  getKeyValue,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { useMemo } from "react";

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
  const totalLiquido = useMemo(
    () => vendas.reduce((soma, v) => soma + (v.VLR_LIQ_VD || 0), 0),
    [vendas]
  );

  const list = useAsyncList({
    async load() {
      return {
        items: vendas.map((item, index) => ({
          ...item,
          __key: `${item.CD_PROD}-${item.EAN ?? "sem-ean"}-${
            item.CD_FILIAL ?? "sem-filial"
          }-${index}`,
        })),
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: [...items].sort((a, b) => {
          let aVal = getKeyValue(a, sortDescriptor.column);
          let bVal = getKeyValue(b, sortDescriptor.column);

          if (typeof aVal === "number" && typeof bVal === "number") {
            return sortDescriptor.direction === "ascending"
              ? aVal - bVal
              : bVal - aVal;
          }

          return sortDescriptor.direction === "ascending"
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        }),
      };
    },
  });

  const totalPaginas = Math.ceil(list.items.length / porPagina);
  const vendasPaginadas = list.items.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
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
        aria-label="Tabela de vendas por loja com ordenação"
        className="max-h-[450px]"
        maxTableHeight={450}
        shadow="sm"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <TableColumn key="CD_FILIAL" allowsSorting>
            Filial
          </TableColumn>
          <TableColumn key="CD_PROD" allowsSorting>
            Código
          </TableColumn>
          <TableColumn key="EAN" allowsSorting>
            EAN
          </TableColumn>
          <TableColumn key="DS_PROD" allowsSorting>
            Descrição
          </TableColumn>
          <TableColumn key="QT_IT" allowsSorting>
            Quantidade
          </TableColumn>
          <TableColumn key="VLR_LIQ_VD" allowsSorting>
            Valor Líquido
          </TableColumn>
          <TableColumn key="VLR_VD" allowsSorting>
            Valor Total
          </TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={loading ? <Spinner /> : "Sem resultados"}
          items={vendasPaginadas}
        >
          {(item) => (
            <TableRow key={item.__key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
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
