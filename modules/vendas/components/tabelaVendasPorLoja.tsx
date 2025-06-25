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
  Divider,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { useEffect, useMemo } from "react";
import { ArrowDownToLine } from "lucide-react";

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

  useEffect(() => {
    list.reload();
  }, [vendas]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg text-zinc-800 font-semibold">Vendas por loja</h2>

        <Button
          color="primary"
          size="sm"
          startContent={<ArrowDownToLine size={14} />}
        >
          Baixar Excel
        </Button>
      </div>
      <div className="flex gap-2">
        <p className="text-sm text-slate-600 font-medium">
          Total de vendas líquidas no período:{" "}
          <strong>R${totalLiquido.toFixed(2)}</strong>
        </p>
        <Divider className="mx-2" orientation="vertical" />
        <p className="text-sm text-slate-700 mb-2">
          Exibindo {vendas.length === 0 ? 0 : (pagina - 1) * porPagina + 1}–
          {(pagina - 1) * porPagina + vendasPaginadas.length} de {vendas.length}{" "}
          resultados
        </p>
      </div>

      <Table
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
          <Pagination
            showControls
            page={pagina}
            total={totalPaginas}
            onChange={setPagina}
          />
        </div>
      )}
    </div>
  );
}
