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
import { useEffect } from "react";
import { ArrowDownToLine } from "lucide-react";

import { IEstoque } from "../types/estoque.interface";

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
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg text-zinc-800 font-semibold">
          Estoque por produto
        </h2>
        <Button
          color="primary"
          size="sm"
          startContent={<ArrowDownToLine size={14} />}
        >
          Baixar Excel
        </Button>
      </div>
      <p className="text-sm text-slate-700 mb-2">
        Exibindo {estoque.length === 0 ? 0 : (pagina - 1) * porPagina + 1}–
        {(pagina - 1) * porPagina + paginados.length} de {estoque.length}{" "}
        resultados
      </p>

      <Table
        isStriped
        aria-label="Estoque agrupado por produto"
        className="max-h-[450px]"
        maxTableHeight={450}
        shadow="sm"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <TableColumn key="dsProd" allowsSorting>
            Descrição
          </TableColumn>
          <TableColumn key="qtEst" allowsSorting>
            Estoque
          </TableColumn>
          <TableColumn key="ean01" allowsSorting>
            EAN
          </TableColumn>
          <TableColumn key="cdProd" allowsSorting>
            Código
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
