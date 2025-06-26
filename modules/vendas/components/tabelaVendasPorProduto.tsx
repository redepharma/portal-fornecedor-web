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

import { IVendaComEAN } from "@/modules/vendas/types/vendaComEan.interface";
import { useEffect } from "react";
import { ArrowDownToLine } from "lucide-react";

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
  const list = useAsyncList({
    async load() {
      return {
        items: vendas.map((item, index) => ({
          ...item,
          __key: `${item.CD_PROD}-${item.EAN ?? "sem-ean"}-${index}`,
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

  useEffect(() => {
    list.reload();
  }, [vendas]);

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-2">
        <div>
          <h2 className="text-lg text-zinc-800 font-semibold">
            Vendas por produto
          </h2>
          <p className="text-sm text-slate-700">
            Exibindo {vendas.length === 0 ? 0 : (pagina - 1) * porPagina + 1}–
            {(pagina - 1) * porPagina + vendasPaginadas.length} de{" "}
            {vendas.length} resultados
          </p>
        </div>
        <Button
          color="primary"
          size="sm"
          startContent={<ArrowDownToLine size={14} />}
        >
          Baixar Excel
        </Button>
      </div>

      <Table
        isStriped
        aria-label="Tabela de vendas por produto com ordenação"
        className="max-h-[450px]"
        maxTableHeight={450}
        shadow="sm"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
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
          <TableColumn key="EAN" allowsSorting>
            EAN
          </TableColumn>
          <TableColumn key="CD_PROD" allowsSorting>
            Código
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
          <Pagination
            showControls
            page={pagina}
            total={totalPaginas}
            onChange={setPagina}
          />
        </div>
      )}
    </>
  );
}
