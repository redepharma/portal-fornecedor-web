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
import { EstoqueService } from "../estoque.service";

interface Props {
  estoque: IEstoqueAgrupado[];
  pagina: number;
  porPagina: number;
  setPagina: (p: number) => void;
  loading: boolean;
  codigosFabricantes?: string[];
}

/**
 * Componente que exibe uma tabela paginada e filtrável do estoque agrupado por produto.
 *
 * Permite ordenação por colunas, filtro por texto (descrição ou EAN) e exportação para Excel.
 *
 * @param {Props} props - Propriedades do componente.
 * @returns {JSX.Element} Tabela com controle de paginação, filtro e exportação.
 */
export function TabelaEstoquePorProduto({
  estoque,
  pagina,
  porPagina,
  setPagina,
  loading,
  codigosFabricantes = [],
}: Props) {
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState<{
    coluna: keyof IEstoqueAgrupado | null;
    direcao: "asc" | "desc";
  }>({ coluna: null, direcao: "asc" });

  useEffect(() => {
    setPagina(1);
  }, [filtro]);

  const handleOrdenar = (coluna: keyof IEstoqueAgrupado) => {
    setOrdenacao((prev) => {
      const mesmaColuna = prev.coluna === coluna;
      const novaDirecao =
        mesmaColuna && prev.direcao === "asc" ? "desc" : "asc";

      return { coluna, direcao: novaDirecao };
    });
  };

  const handleExportar = () => {
    if (estoque.length === 0) return;
    EstoqueService.exportarExcelEstoquePorFilial(codigosFabricantes);
  };

  const dadosFiltrados = useMemo(() => {
    const termo = filtro.toLowerCase();

    const filtrados = estoque.filter(
      (item) =>
        item.dsProd?.toLowerCase().includes(termo) ||
        item.ean01?.toLowerCase().includes(termo)
    );

    if (!ordenacao.coluna) return filtrados;

    return [...filtrados].sort((a, b) => {
      const aVal = a[ordenacao.coluna!];
      const bVal = b[ordenacao.coluna!];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return ordenacao.direcao === "asc" ? aVal - bVal : bVal - aVal;
      }

      return ordenacao.direcao === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [estoque, filtro, ordenacao]);

  const paginados = useMemo(() => {
    return dadosFiltrados.slice((pagina - 1) * porPagina, pagina * porPagina);
  }, [dadosFiltrados, pagina, porPagina]);

  const totalPaginas = Math.ceil(dadosFiltrados.length / porPagina);

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
          <TableColumn allowsSorting onClick={() => handleOrdenar("dsProd")}>
            Descrição
          </TableColumn>
          <TableColumn allowsSorting onClick={() => handleOrdenar("qtEst")}>
            Estoque
          </TableColumn>
          <TableColumn allowsSorting onClick={() => handleOrdenar("ean01")}>
            EAN
          </TableColumn>
          <TableColumn allowsSorting onClick={() => handleOrdenar("cdProd")}>
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
