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
  Divider,
} from "@heroui/react";
import { useMemo, useState, useEffect } from "react";
import { RotateCw, Search } from "lucide-react";

import { IStatusPedidoMultigiro } from "../types/status-pedido.interface";

type Ordenacao = {
  coluna: keyof IStatusPedidoMultigiro | null;
  direcao: "asc" | "desc";
};

interface Props {
  titulo?: string;
  dados: IStatusPedidoMultigiro[];
  pagina: number;
  porPagina: number;
  setPagina: (p: number) => void;
  loading: boolean;
  onRefresh?: () => void;
}

export function TabelaStatusPedidos({
  titulo = "Status Pedido",
  dados,
  pagina,
  porPagina,
  setPagina,
  loading,
  onRefresh,
}: Props) {
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>({
    coluna: null,
    direcao: "asc",
  });

  // sempre que filtrar, volta pra página 1
  useEffect(() => {
    setPagina(1);
  }, [filtro, setPagina]);

  const handleOrdenar = (coluna: keyof IStatusPedidoMultigiro) => {
    setOrdenacao((prev) => {
      const direcao =
        prev.coluna === coluna && prev.direcao === "asc" ? "desc" : "asc";

      return { coluna, direcao };
    });
  };

  const dadosFiltrados = useMemo(() => {
    const termo = filtro.trim().toLowerCase();

    if (!termo) return dados;

    return dados.filter((d) => {
      const campos = [
        d.seqPedido,
        d.nroPedVenda,
        d.nroEmpresa,
        d.statusIntegracao,
        d.idPedidoCanalVenda,
      ];

      return campos.some((c) =>
        String(c ?? "")
          .toLowerCase()
          .includes(termo)
      );
    });
  }, [dados, filtro]);

  const dadosOrdenados = useMemo(() => {
    if (!ordenacao.coluna) return dadosFiltrados;
    const { coluna, direcao } = ordenacao;

    return [...dadosFiltrados].sort((a, b) => {
      const av = a[coluna!];
      const bv = b[coluna!];

      // números
      if (typeof av === "number" && typeof bv === "number") {
        return direcao === "asc" ? av - bv : bv - av;
      }

      // strings / nullables
      return direcao === "asc"
        ? String(av ?? "").localeCompare(String(bv ?? ""))
        : String(bv ?? "").localeCompare(String(av ?? ""));
    });
  }, [dadosFiltrados, ordenacao]);

  const paginados = useMemo(() => {
    const ini = (pagina - 1) * porPagina;
    const fim = ini + porPagina;

    return dadosOrdenados.slice(ini, fim);
  }, [dadosOrdenados, pagina, porPagina]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(dadosOrdenados.length / porPagina)
  );
  const exibindoDe =
    dadosOrdenados.length === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const exibindoAte = (pagina - 1) * porPagina + paginados.length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg text-zinc-800 font-semibold">{titulo}</h2>
        <div className="flex gap-3 items-center">
          <Input
            placeholder="Pesquisar (seq, venda, status, empresa...)"
            size="sm"
            startContent={<Search color="#77767b" size={14} />}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <Button
            className="bg-zinc-800 text-white"
            isLoading={loading}
            size="sm"
            startContent={<RotateCw size={14} />}
            onPress={onRefresh}
          >
            Atualizar
          </Button>
        </div>
      </div>

      <p className="text-sm text-slate-700 mb-2">
        Exibindo {exibindoDe}–{exibindoAte} de {dadosOrdenados.length}{" "}
        resultados
      </p>

      <Table
        isStriped
        aria-label="Tabela de status de pedidos com ordenação e filtro"
        className="max-h-[600px]"
        maxTableHeight={600}
        shadow="sm"
      >
        <TableHeader>
          <TableColumn
            allowsSorting
            className="text-center"
            onClick={() => handleOrdenar("seqPedido")}
          >
            SEQPEDIDO
          </TableColumn>
          <TableColumn
            allowsSorting
            className="text-center"
            onClick={() => handleOrdenar("nroPedVenda")}
          >
            Nº PEDIDO DA VENDA
          </TableColumn>
          <TableColumn
            allowsSorting
            className="text-center"
            onClick={() => handleOrdenar("statusIntegracao")}
          >
            STATUS INTEGRAÇÃO
          </TableColumn>
          <TableColumn
            allowsSorting
            className="text-center"
            onClick={() => handleOrdenar("nroEmpresa")}
          >
            EMPRESA
          </TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={loading ? <Spinner /> : "Sem resultados"}
          items={paginados}
        >
          {(pedido) => (
            <TableRow
              key={
                pedido?.seqPedido ??
                `${pedido?.idPedidoCanalVenda}-${pedido?.nroEmpresa}`
              }
            >
              <TableCell className="text-center">{pedido.seqPedido}</TableCell>
              <TableCell className="text-center">
                {pedido.nroPedVenda ?? "-"}
              </TableCell>
              <TableCell className="text-center">
                {pedido.statusIntegracao}
              </TableCell>
              <TableCell className="text-center">{pedido.nroEmpresa}</TableCell>
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

      <Divider className="my-4" />
    </div>
  );
}
