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
  Input,
  addToast,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, Search } from "lucide-react";

import { VendaService } from "../vendas.service";

import { IVendaComEAN } from "@/modules/vendas/types/vendaComEan.interface";

interface TabelaVendasProps {
  vendas: IVendaComEAN[];
  pagina: number;
  porPagina: number;
  setPagina: (page: number) => void;
  loading: boolean;
  codigosFabricantes?: string[];
  dataInicio?: string;
  dataFim?: string;
}

export function TabelaVendasPorProduto({
  vendas,
  pagina,
  porPagina,
  setPagina,
  loading,
  codigosFabricantes = [],
  dataInicio,
  dataFim,
}: TabelaVendasProps) {
  const [baixandoExcel, setBaixandoExcel] = useState(false);

  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState<{
    coluna: keyof IVendaComEAN | null;
    direcao: "asc" | "desc";
  }>({ coluna: null, direcao: "asc" });

  const vendasFiltradas = useMemo(() => {
    const termo = filtro.toLowerCase();

    let resultado = vendas.filter((item) => {
      return (
        item.DS_PROD?.toLowerCase().includes(termo) ||
        item.EAN?.toLowerCase().includes(termo)
      );
    });

    if (ordenacao.coluna) {
      resultado = [...resultado].sort((a, b) => {
        const aVal = a[ordenacao.coluna!];
        const bVal = b[ordenacao.coluna!];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return ordenacao.direcao === "asc" ? aVal - bVal : bVal - aVal;
        }

        return ordenacao.direcao === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return resultado;
  }, [vendas, filtro, ordenacao]);

  const totalPaginas = Math.ceil(vendasFiltradas.length / porPagina);
  const vendasPaginadas = vendasFiltradas.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  useEffect(() => {
    setPagina(1);
  }, [filtro]);

  const handleOrdenar = (coluna: keyof IVendaComEAN) => {
    setOrdenacao((prev) => {
      if (prev.coluna === coluna) {
        return {
          coluna,
          direcao: prev.direcao === "asc" ? "desc" : "asc",
        };
      }

      return { coluna, direcao: "asc" };
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-2">
        <div>
          <h2 className="text-lg text-zinc-800 font-semibold">
            Vendas por produto
          </h2>
          <p className="text-sm text-slate-700">
            Exibindo{" "}
            {vendasFiltradas.length === 0 ? 0 : (pagina - 1) * porPagina + 1}–
            {(pagina - 1) * porPagina + vendasPaginadas.length} de{" "}
            {vendasFiltradas.length} resultados
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Input
            isDisabled={vendas.length === 0}
            placeholder="Pesquisar por nome ou EAN"
            size="sm"
            startContent={<Search color="#77767b" size={14} />}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <Button
            className="max-w-fit w-full"
            color="primary"
            isDisabled={
              !codigosFabricantes.length ||
              !dataInicio ||
              !dataFim ||
              vendas.length === 0
            }
            isLoading={baixandoExcel}
            size="sm"
            startContent={<ArrowDownToLine size={14} />}
            onPress={async () => {
              setBaixandoExcel(true);
              try {
                await VendaService.exportarVendasExcel({
                  codigoFabricante: codigosFabricantes.join(","),
                  dataInicio: dataInicio ?? "",
                  dataFim: dataFim ?? "",
                });
              } catch (error) {
                const mensagem =
                  error instanceof Error
                    ? error.message
                    : "Erro ao baixar o Excel";

                addToast({
                  title: "Erro ao baixar Excel",
                  description: mensagem,
                  color: "danger",
                });
              } finally {
                setBaixandoExcel(false);
              }
            }}
          >
            Baixar Excel
          </Button>
        </div>
      </div>

      <Table
        isStriped
        aria-label="Tabela de vendas por produto com ordenação"
        className="max-h-[450px]"
        maxTableHeight={450}
        shadow="sm"
      >
        <TableHeader>
          <TableColumn onClick={() => handleOrdenar("DS_PROD")}>
            Descrição
          </TableColumn>
          <TableColumn onClick={() => handleOrdenar("QT_IT")}>
            Quantidade
          </TableColumn>
          <TableColumn onClick={() => handleOrdenar("VLR_LIQ_VD")}>
            Valor Líquido
          </TableColumn>
          <TableColumn onClick={() => handleOrdenar("VLR_VD")}>
            Valor Total
          </TableColumn>
          <TableColumn onClick={() => handleOrdenar("EAN")}>EAN</TableColumn>
          <TableColumn onClick={() => handleOrdenar("CD_PROD")}>
            Código
          </TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={loading ? <Spinner /> : "Sem resultados"}
          items={vendasPaginadas}
        >
          {(item) => (
            <TableRow key={`${item.CD_PROD}-${item.EAN ?? "sem-ean"}`}>
              <TableCell>{item.DS_PROD}</TableCell>
              <TableCell>{item.QT_IT}</TableCell>
              <TableCell>{item.VLR_LIQ_VD}</TableCell>
              <TableCell>{item.VLR_VD}</TableCell>
              <TableCell>{item.EAN}</TableCell>
              <TableCell>{item.CD_PROD}</TableCell>
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
