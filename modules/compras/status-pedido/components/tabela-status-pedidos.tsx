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
  Chip,
} from "@heroui/react";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";

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
        d.codigoPedido,
        d.codigoFornecedor,
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
    const { coluna, direcao } = ordenacao;

    const getPriority = (s?: string) => (s === "Rejeitado" ? 0 : 1);

    const cmpBase = (a: IStatusPedidoMultigiro, b: IStatusPedidoMultigiro) => {
      // 1) prioridade: Rejeitado sempre vem antes
      const pa = getPriority(a.statusIntegracao);
      const pb = getPriority(b.statusIntegracao);

      if (pa !== pb) return pa - pb;

      // 2) ordenação escolhida (se houver)
      if (!coluna) return 0;

      const av = a[coluna];
      const bv = b[coluna];

      const aNum = typeof av === "number" ? av : Number.NaN;
      const bNum = typeof bv === "number" ? bv : Number.NaN;

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return direcao === "asc" ? aNum - bNum : bNum - aNum;
      }

      const as = String(av ?? "");
      const bs = String(bv ?? "");

      return direcao === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    };

    return [...dadosFiltrados].sort(cmpBase);
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
        <div className="flex gap-3 items-center max-w-md w-full">
          <Input
            placeholder="Pesquisar (seq, interno, fornecedor, status...)"
            size="sm"
            startContent={<Search color="#77767b" size={14} />}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <Button
            color="primary"
            isLoading={loading}
            size="sm"
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
            Nº Pedido fornecedor
          </TableColumn>
          <TableColumn
            allowsSorting
            className="text-center"
            onClick={() => handleOrdenar("codigoPedido")}
          >
            Cód. Pedido interno
          </TableColumn>
          <TableColumn
            allowsSorting
            className="text-center"
            onClick={() => handleOrdenar("codigoFornecedor")}
          >
            Cód. Fornecedor
          </TableColumn>
          <TableColumn
            allowsSorting
            className="text-center"
            onClick={() => handleOrdenar("statusIntegracao")}
          >
            STATUS INTEGRAÇÃO
          </TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={loading ? <Spinner /> : "Sem resultados"}
          items={paginados}
        >
          {(pedido) => (
            <TableRow key={pedido?.seqPedido}>
              <TableCell className="text-center">{pedido.seqPedido}</TableCell>
              <TableCell className="text-center">
                {pedido.codigoPedido ?? "-"}
              </TableCell>
              <TableCell className="text-center">
                {pedido.codigoFornecedor ?? "-"}
              </TableCell>
              <TableCell className="text-center">
                {pedido.statusIntegracao === "Finalizado" ? (
                  <Chip>{pedido.statusIntegracao}</Chip>
                ) : pedido.statusIntegracao === "Rejeitado" ? (
                  <Chip color="danger">{pedido.statusIntegracao}</Chip>
                ) : (
                  <Chip color="warning">{pedido.statusIntegracao}</Chip>
                )}
              </TableCell>
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
