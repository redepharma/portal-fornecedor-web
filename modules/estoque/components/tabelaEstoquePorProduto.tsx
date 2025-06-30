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
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, Search } from "lucide-react";

import { IEstoqueAgrupado } from "../types/estoqueAgrupado.interface";

interface Props {
  estoque: IEstoqueAgrupado[];
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
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState<{
    coluna: keyof IEstoqueAgrupado | null;
    direcao: "asc" | "desc";
  }>({ coluna: null, direcao: "asc" });

  const dadosFiltrados = useMemo(() => {
    const termo = filtro.toLowerCase();

    let resultado = estoque.filter((item) => {
      return (
        item.dsProd?.toLowerCase().includes(termo) ||
        item.ean01?.toLowerCase().includes(termo)
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
  }, [estoque, filtro, ordenacao]);

  const totalPaginas = Math.ceil(dadosFiltrados.length / porPagina);
  const paginados = dadosFiltrados.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  useEffect(() => {
    setPagina(1);
  }, [filtro]);

  const handleOrdenar = (coluna: keyof IEstoqueAgrupado) => {
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
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg text-zinc-800 font-semibold">
          Estoque por produto
        </h2>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Pesquisar por nome ou EAN"
            size="sm"
            startContent={<Search color="#77767b" size={14} />}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <Button
            className="max-w-fit w-full"
            color="primary"
            size="sm"
            startContent={<ArrowDownToLine size={14} />}
          >
            Baixar Excel
          </Button>
        </div>
      </div>

      <p className="text-sm text-slate-700 mb-2">
        Exibindo{" "}
        {dadosFiltrados.length === 0 ? 0 : (pagina - 1) * porPagina + 1}–
        {(pagina - 1) * porPagina + paginados.length} de {dadosFiltrados.length}{" "}
        resultados
      </p>

      <Table
        isStriped
        aria-label="Estoque agrupado por produto"
        className="max-h-[450px]"
        maxTableHeight={450}
        shadow="sm"
      >
        <TableHeader>
          <TableColumn onClick={() => handleOrdenar("dsProd")}>
            Descrição
          </TableColumn>
          <TableColumn onClick={() => handleOrdenar("qtEst")}>
            Estoque
          </TableColumn>
          <TableColumn onClick={() => handleOrdenar("ean01")}>EAN</TableColumn>
          <TableColumn onClick={() => handleOrdenar("cdProd")}>
            Código
          </TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={loading ? <Spinner /> : "Sem resultados"}
          items={paginados}
        >
          {(item) => (
            <TableRow key={`${item.cdProd}-${item.cdFilial}`}>
              <TableCell>{item.dsProd}</TableCell>
              <TableCell>{item.qtEst}</TableCell>
              <TableCell>{item.ean01}</TableCell>
              <TableCell>{item.cdProd}</TableCell>
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
