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

import { IEstoque } from "../types/estoque.interface";
import { useEffect } from "react";

interface Props {
  estoque: IEstoque[];
  pagina: number;
  porPagina: number;
  setPagina: (p: number) => void;
  loading: boolean;
}

export function TabelaEstoquePorProduto({
  estoque,
  pagina,
  porPagina,
  setPagina,
  loading,
}: Props) {
  const list = useAsyncList({
    async load() {
      return {
        items: estoque.map((item, index) => ({
          ...item,
          __key: `${item.cdProd}-${item.cdFilial}-${index}`,
        })),
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: [...items].sort((a, b) => {
          const aVal = getKeyValue(a, sortDescriptor.column);
          const bVal = getKeyValue(b, sortDescriptor.column);

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
  const paginados = list.items.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  useEffect(() => {
    list.reload();
  }, [estoque]);

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
        aria-label="Estoque agrupado por produto"
        className="max-h-[450px]"
        maxTableHeight={450}
        shadow="sm"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <TableColumn key="cdProd" allowsSorting>
            Código
          </TableColumn>
          <TableColumn key="ean01" allowsSorting>
            EAN
          </TableColumn>
          <TableColumn key="dsProd" allowsSorting>
            Descrição
          </TableColumn>
          <TableColumn key="qtEst" allowsSorting>
            Estoque
          </TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={loading ? <Spinner /> : "Sem resultados"}
          items={paginados}
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
    </>
  );
}
