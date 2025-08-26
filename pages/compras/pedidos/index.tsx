"use client";

import {
  Checkbox,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  addToast,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { SquarePlus, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";

import DefaultLayout from "@/layouts/default";
import { ILoja } from "@/modules/pedidos-api/lojas/loja.types";
import { IFornecedorPedido } from "@/modules/pedidos-api/fornecedores/fornecedor-pedido.interface";
import { LojasService } from "@/modules/pedidos-api/lojas/lojas.service";
import { FornecedorPedidosService } from "@/modules/pedidos-api/fornecedores/fornecedor.service";
import { PedidosEnvioService } from "@/modules/pedidos-api/pedidos/enviar-pedidos.service";

// ---- Tipos locais para as linhas do formulário ----
type Row = {
  id: string;
  codigoPedido: string; // input numérico como string
  loja: string; // key do Select (string com o código)
  fornecedor: string; // key do Select (string com o código)
  pedidoDeFraldas: boolean;
};

export default function IndexPage() {
  const filtersRef = useRef<HTMLDivElement>(null);
  const errorsRef = useRef<HTMLDivElement>(null);

  // ===== TABELA DE ERROS (linhas) =====
  type ErroRow = {
    id: string; // id interno da linha (uuid)
    numeroPedido: string; // ex.: "789456"
    loja: string; // ex.: "101"
    produto: string; // pode ser "—" ou "Vários"
    erro: string; // "EANs incompatíveis"
    eans: string[]; // lista para o modal
  };
  const [erros, setErros] = useState<ErroRow[]>([]);

  // ===== MODAL =====
  const [isErroModalOpen, setIsErroModalOpen] = useState(false);
  const [erroSelecionado, setErroSelecionado] = useState<ErroRow | null>(null);

  // opções dos selects
  const [lojas, setLojas] = useState<ILoja[]>([]);
  const [fornecedores, setFornecedores] = useState<IFornecedorPedido[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // linhas do formulário
  const [rows, setRows] = useState<Row[]>([
    {
      id: crypto.randomUUID(),
      codigoPedido: "",
      loja: "",
      fornecedor: "",
      pedidoDeFraldas: false,
    },
  ]);

  // validação simples
  const isFormValid = useMemo(
    () =>
      rows.every(
        ({ loja, fornecedor, codigoPedido }) =>
          Boolean(loja) && Boolean(fornecedor) && Boolean(codigoPedido)
      ),
    [rows]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // carregar lojas e fornecedores
  useEffect(() => {
    const ac = new AbortController();

    async function loadOptions() {
      try {
        setIsLoadingOptions(true);
        const [lojasRes, fornecedoresRes] = await Promise.all([
          LojasService.buscarLojasPedidos({ signal: ac.signal }),
          FornecedorPedidosService.buscarFornecedoresPedidos({
            signal: ac.signal,
          }),
        ]);

        setLojas(lojasRes);
        setFornecedores(fornecedoresRes);
      } catch (e) {
        addToast({ title: "Falha ao carregar opções de lojas/fornecedores." });
      } finally {
        setIsLoadingOptions(false);
      }
    }
    loadOptions();

    return () => ac.abort();
  }, []);

  function extrairProdutosNaoEncontrados(
    produtosNaoEncontrados: any[]
  ): string[] {
    if (!Array.isArray(produtosNaoEncontrados)) return [];

    return produtosNaoEncontrados
      .map((p) => {
        const ean =
          p?.cd_barra ??
          p?.ean ??
          p?.codigoEan ??
          p?.codAcesso ??
          p?.codigo_barras ??
          p?.codigoBarras ??
          p?.codigo ??
          null;

        const descricao =
          p?.descricao ?? p?.descricaoProduto ?? p?.nome ?? p?.titulo ?? null;

        if (ean && descricao) return `${ean} — ${descricao}`;
        if (ean) return String(ean);
        if (descricao) return String(descricao);

        return null;
      })
      .filter((v): v is string => Boolean(v));
  }

  function extrairEans(produtosNaoEncontrados: any[]): string[] {
    if (!Array.isArray(produtosNaoEncontrados)) return [];

    return produtosNaoEncontrados
      .map(
        (p) =>
          // tenta vários nomes comuns de campo
          p?.ean ??
          p?.codigoEan ??
          p?.codAcesso ??
          p?.codigo_barras ??
          p?.codigoBarras ??
          p?.codigo ??
          null
      )
      .filter((v): v is string | number => v !== null)
      .map((v) => String(v));
  }

  // adicionar linha
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        codigoPedido: "",
        loja: "",
        fornecedor: "",
        pedidoDeFraldas: false,
      },
    ]);
  };

  // scroll até a última linha quando adicionar
  useEffect(() => {
    const el = filtersRef.current;

    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [rows.length]);

  // helpers de estado
  function updateRow<K extends keyof Row>(
    index: number,
    key: K,
    value: Row[K]
  ) {
    setRows((prev) => {
      const next = [...prev];

      next[index] = { ...next[index], [key]: value };

      return next;
    });
  }
  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  // submit
  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) {
      addToast({ title: "Preencha todos os campos" });

      return;
    }

    setIsSubmitting(true);

    try {
      const results = await Promise.allSettled(
        rows.map(({ codigoPedido, fornecedor, loja, pedidoDeFraldas }) => {
          const codigoLoja = Number(String(loja).replace(/\D/g, ""));

          return PedidosEnvioService.enviar({
            codigoFornecedor: Number(fornecedor),
            codigoPedido: Number(codigoPedido),
            codigoLoja,
            pedidoDeFraldas,
          });
        })
      );

      let sucesso = 0;
      const failedRows: Row[] = [];
      const novosErros: ErroRow[] = [];

      results.forEach((r, idx) => {
        const rowOrig = rows[idx];
        const lojaNum = String(rowOrig.loja).replace(/\D/g, "");

        if (r.status === "fulfilled") {
          const data = r.value as any;

          // 🚨 Captura SUCESSO PARCIAL (206) vindo do backend
          if (data && data.statusCode === 206) {
            const eans = extrairProdutosNaoEncontrados(
              data.produtosNaoEncontrados
            );

            novosErros.push({
              id: crypto.randomUUID(),
              numeroPedido: rowOrig.codigoPedido,
              loja: lojaNum || rowOrig.loja,
              produto: eans.length > 1 ? "Vários" : (eans[0] ?? "—"),
              erro: "EANs incompatíveis",
              eans,
            });

            failedRows.push(rowOrig);
          } else {
            sucesso += 1;
          }
        } else {
          // Rejected → falha total
          failedRows.push(rowOrig);
          const anyErr: any = r.reason;
          const msg =
            anyErr?.response?.data?.message ??
            anyErr?.message ??
            "Falha ao enviar pedido.";

          addToast({ title: msg });
        }
      });

      if (sucesso > 0) {
        addToast({ title: `${sucesso} pedido(s) enviado(s) com sucesso.` });
      }

      // adiciona as novas linhas de erro à tabela
      if (novosErros.length > 0) {
        setErros((prev) => [...novosErros, ...prev]);
        addToast({ title: `${novosErros.length} com EANs incompatíveis.` });
      }

      // Atualiza o formulário: mantém apenas as linhas que falharam/206
      setRows(
        failedRows.length > 0
          ? failedRows
          : [
              {
                id: crypto.randomUUID(),
                codigoPedido: "",
                loja: "",
                fornecedor: "",
                pedidoDeFraldas: false,
              },
            ]
      );
    } catch {
      addToast({ title: "Erro inesperado ao enviar pedidos." });
    } finally {
      setIsSubmitting(false);
    }
  }

  // 1) Mude a assinatura
  async function handleEnviarTeste() {
    if (!isFormValid) {
      addToast({ title: "Preencha todos os campos" });

      return;
    }
    setIsSubmitting(true);
    try {
      const results = await Promise.allSettled(
        rows.map(({ codigoPedido, fornecedor, loja, pedidoDeFraldas }) => {
          const codigoLoja = Number(String(loja).replace(/\D/g, ""));

          return PedidosEnvioService.enviarTeste({
            codigoFornecedor: Number(fornecedor),
            codigoPedido: Number(codigoPedido),
            codigoLoja,
            pedidoDeFraldas,
          });
        })
      );

      const sucesso = results.filter((r) => r.status === "fulfilled").length;
      const falhas = results.filter((r) => r.status === "rejected").length;

      if (sucesso > 0) {
        addToast({
          title: `${sucesso} pedido(s) (teste) enviado(s) com sucesso.`,
        });
      }

      const failedRows: Row[] = [];

      results.forEach((r, idx) => {
        if (r.status === "rejected") {
          failedRows.push(rows[idx]);
          const anyErr: any = r.reason;
          const msg =
            anyErr?.response?.data?.message ??
            anyErr?.message ??
            "Falha ao enviar pedido (teste).";

          addToast({ title: msg });
        }
      });

      setRows(
        falhas > 0
          ? failedRows
          : [
              {
                id: crypto.randomUUID(),
                codigoPedido: "",
                loja: "",
                fornecedor: "",
                pedidoDeFraldas: false,
              },
            ]
      );
    } catch {
      addToast({ title: "Erro inesperado ao enviar pedidos (teste)." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DefaultLayout>
      <form onSubmit={handleEnviar}>
        <div className="flex flex-col justify-between">
          <h1 className="text-4xl text-zinc-800 font-bold">PEDIDOS</h1>
          <p className="text-sm text-slate-500">
            Solicitação de pedidos de compra
          </p>
          <Divider className="my-4" />

          {/* Container das linhas (tem altura fixa e overflow) */}
          <div ref={filtersRef} className="h-60 overflow-y-auto">
            {rows.map((row, index) => (
              <div
                key={row.id}
                className="flex flex-row flex-wrap justify-center items-center gap-4 py-1"
              >
                <Input
                  className="max-w-44"
                  inputMode="numeric"
                  isInvalid={
                    Boolean(row.codigoPedido) === false && isSubmitting
                  }
                  label="Código do pedido"
                  value={row.codigoPedido}
                  onValueChange={(v) =>
                    updateRow(index, "codigoPedido", v.replace(/\D/g, ""))
                  }
                />

                <Select
                  disallowEmptySelection
                  className="max-w-24"
                  isDisabled={isLoadingOptions}
                  items={lojas}
                  label={isLoadingOptions ? "Carregando lojas..." : "Loja"}
                  selectedKeys={row.loja ? new Set([row.loja]) : new Set()}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string | undefined;

                    updateRow(index, "loja", key ?? "");
                  }}
                >
                  {(item) => (
                    <SelectItem key={String(item.codigo)}>
                      {String(item.codigo)}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  disallowEmptySelection
                  className="max-w-xs"
                  isDisabled={isLoadingOptions}
                  items={fornecedores}
                  label={
                    isLoadingOptions
                      ? "Carregando fornecedores..."
                      : "Fornecedor"
                  }
                  selectedKeys={
                    row.fornecedor ? new Set([row.fornecedor]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string | undefined;

                    updateRow(index, "fornecedor", key ?? "");
                  }}
                >
                  {(item) => (
                    <SelectItem key={String(item.cd_forn)}>
                      {`${item.cd_forn} - ${item.nome_forn}`}
                    </SelectItem>
                  )}
                </Select>

                <Checkbox
                  isSelected={row.pedidoDeFraldas}
                  onValueChange={(v) => updateRow(index, "pedidoDeFraldas", v)}
                >
                  Pedido de fraldas
                </Checkbox>

                {/* Reserva de espaço p/ o botão, mantendo alinhamento */}
                <div className="w-6 flex justify-center">
                  {index === rows.length - 1 ? (
                    <button
                      title="Adicionar linha"
                      type="button"
                      onClick={addRow}
                    >
                      <SquarePlus color="#f05411" size={24} />
                    </button>
                  ) : null}
                </div>

                {/* Remover linha (opcional) */}
                {rows.length > 1 ? (
                  <Button
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => removeRow(index)}
                  >
                    Remover
                  </Button>
                ) : null}
              </div>
            ))}
          </div>

          {/* Ação de envio */}
          <div className="flex justify-center mt-6 gap-3">
            <Button
              color="primary"
              isDisabled={isSubmitting || !isFormValid}
              startContent={<SendHorizontal size={18} />}
              type="submit"
            >
              {isSubmitting ? "Enviando…" : "Enviar"}
            </Button>

            {/* Botão de ENVIO TESTE */}
            <Button
              isDisabled={isSubmitting || !isFormValid}
              type="button"
              variant="bordered"
              onPress={handleEnviarTeste}
            >
              Enviar (teste)
            </Button>
          </div>

          {/* Tabela de erros */}
          <div className="flex flex-col gap-2 mt-4">
            <Divider className="my-1" />
            <h2 className="text-2xl text-zinc-800 font-bold ">ERROS</h2>
            <div
              ref={errorsRef}
              className="overflow-y-auto"
              style={{ height: "300px" }}
            >
              <Table
                isCompact
                isStriped
                aria-label="Tabela de erros"
                className="max-h-[280px] text-neutral-700 p-1"
                style={{ height: "280px" }}
              >
                <TableHeader>
                  <TableColumn key="numeroPedido" allowsSorting>
                    NÚMERO DO PEDIDO
                  </TableColumn>
                  <TableColumn key="loja" allowsSorting>
                    LOJA
                  </TableColumn>
                  <TableColumn key="produto" allowsSorting>
                    PRODUTO
                  </TableColumn>
                  <TableColumn key="erro" allowsSorting>
                    ERRO
                  </TableColumn>
                </TableHeader>

                <TableBody
                  emptyContent="Sem dados para exibir."
                  loadingContent={<Spinner label="Carregando..." />}
                >
                  {erros.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="text-center text-sm text-slate-500"
                        colSpan={4}
                      >
                        Sem dados para exibir.
                      </TableCell>
                    </TableRow>
                  ) : (
                    erros.map((er) => (
                      <TableRow
                        key={er.id}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => {
                          setErroSelecionado(er);
                          setIsErroModalOpen(true);
                        }}
                      >
                        <TableCell>{er.numeroPedido}</TableCell>
                        <TableCell>{er.loja}</TableCell>
                        <TableCell>{er.produto}</TableCell>
                        <TableCell>{er.erro}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {/* ========= FIM: TABELA DE ERROS ========= */}
        </div>
      </form>
      <Modal
        isOpen={isErroModalOpen}
        size="2xl"
        onOpenChange={setIsErroModalOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">
                EANs incompatíveis
                {erroSelecionado ? (
                  <span className="text-xs text-slate-500">
                    Pedido {erroSelecionado.numeroPedido} • Loja{" "}
                    {erroSelecionado.loja}
                  </span>
                ) : null}
              </ModalHeader>
              <ModalBody>
                {erroSelecionado?.eans?.length ? (
                  <ul className="list-disc pl-5 text-sm">
                    {erroSelecionado.eans.map((ean, i) => (
                      <li key={`${ean}-${i}`}>{ean}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    Sem EANs para exibir.
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Fechar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}
