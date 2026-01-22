"use client";

import type { Selection } from "@heroui/react";

import { useEffect, useState } from "react";
import {
  addToast,
  Button,
  DateRangePicker,
  Divider,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
} from "@heroui/react";
import { DateValue } from "@internationalized/date";
import { Select, SelectItem } from "@heroui/react";
import { Eraser, Search } from "lucide-react";

import DefaultLayout from "@/layouts/default";
import { FornecedorService } from "@/modules/fornecedor/fornecedor.service";
import { VendaService } from "@/modules/fornecedor/vendas/vendas.service";
import { useAuth } from "@/hooks/use-auth";
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { IFabricante } from "@/modules/fornecedor/types/fabricante.interface";
import { IVendaComEAN } from "@/modules/fornecedor/vendas/types/vendaComEan.interface";
import { IVendaPorFilial } from "@/modules/fornecedor/vendas/types/vendaPorLoja.interface";
import { TabelaVendasPorProduto } from "@/modules/fornecedor/vendas/components/tabelaVendasPorProduto";
import { TabelaVendasPorLoja } from "@/modules/fornecedor/vendas/components/tabelaVendasPorLoja";

/**
 * Componente principal para consulta e exibição de vendas agrupadas por produto e por loja,
 * com seleção de fabricantes e intervalo de datas.
 */
function FornecedorVendas() {
  const { user } = useAuth();

  const [fabricantes, setFabricantes] = useState<IFabricante[]>([]);
  const [selecionados, setSelecionados] = useState<Selection>(new Set([]));
  const [dataRange, setDataRange] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>(null);

  const [vendasPorProduto, setVendasPorProduto] = useState<IVendaComEAN[]>([]);
  const [vendasPorLoja, setVendasPorLoja] = useState<IVendaPorFilial[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  useEffect(() => {
    if (!user?.codigoInterno) return;

    const codigos: number[] = user.codigoInterno
      .split(",")
      .map((codigo) => parseInt(codigo, 10))
      .filter((c) => !isNaN(c));

    FornecedorService.listarFabricantes(codigos).then(setFabricantes);
  }, [user?.codigoInterno]);

  /**
   * Executa a busca das vendas com base nos fabricantes selecionados e no intervalo de datas.
   * Valida período antes da consulta e exibe notificações para sucesso ou erro.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dataRange?.start || !dataRange?.end) {
      addToast({
        title: "Período obrigatório",
        description:
          "Selecione uma data de início e fim para consultar as vendas.",
      });

      return;
    }

    setLoading(true);
    setVendasPorProduto([]);

    const dataInicio = dataRange.start.toString();
    const dataFim = dataRange.end.toString();

    try {
      const resultadosPorProduto: IVendaComEAN[] = [];
      const resultadosPorLoja: IVendaPorFilial[] = [];
      const codigos = Array.from(selecionados).map(String).join(",");

      const respostaPorProduto = await VendaService.consultarVendas({
        codigoFabricante: codigos,
        dataInicio,
        dataFim,
      });

      resultadosPorProduto.push(...respostaPorProduto);

      const respostaPorLoja = await VendaService.consultarVendasPorLoja({
        codigoFabricante: codigos,
        dataInicio,
        dataFim,
      });

      resultadosPorLoja.push(...respostaPorLoja);

      setVendasPorProduto(resultadosPorProduto);
      setVendasPorLoja(resultadosPorLoja);
      setPagina(1);

      if (resultadosPorProduto.length === 0) {
        addToast({
          title: "Nenhum dado encontrado",
          description: "Não foram encontradas vendas no período informado.",
        });
      } else {
        addToast({
          title: "Consulta realizada com sucesso",
          description: `Foram encontradas ${resultadosPorProduto.length} vendas.`,
        });
      }
    } catch (erro: any) {
      const mensagem =
        erro?.response?.data?.mensagem || "Erro ao consultar vendas.";
      const detalhe =
        erro?.response?.data?.detalhe ||
        "Tente novamente mais tarde, se persistir, entre em contato com o suporte.";

      addToast({
        title: mensagem,
        description: detalhe,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reseta os filtros de fabricantes selecionados e período de data,
   * limpa as vendas exibidas e exibe uma notificação.
   */
  const handleLimparFiltros = () => {
    setSelecionados(new Set([]));
    setDataRange(null);
    setVendasPorProduto([]);
    setPagina(1);

    addToast({
      title: "Filtros limpos",
      description: "Seleção de fabricantes e datas foi reiniciada.",
    });
  };

  return (
    <DefaultLayout>
      <h1 className="text-4xl text-zinc-800 font-bold">VENDAS</h1>
      <p className="text-sm text-slate-500">
        Exibição de vendas por período, agrupadas por produto e por loja
      </p>
      <Divider className="my-6" />
      <div className="flex w-full gap-4 items-center justify-start rounded-xl">
        <form
          className="flex gap-4 items-center justify-center"
          onSubmit={handleSubmit}
        >
          {fabricantes.length === 0 ? (
            <div className="w-[300px]">
              <Skeleton className="h-[56px] w-full rounded-medium" />
              <Skeleton className="h-[16px] w-2/3 mt-2 rounded-small" />
            </div>
          ) : (
            <Select
              className="w-[300px]"
              description="Selecione um ou mais fabricantes"
              label="Fabricantes"
              selectedKeys={selecionados}
              selectionMode="single"
              variant="bordered"
              onSelectionChange={setSelecionados}
            >
              {fabricantes.map((fab) => (
                <SelectItem key={String(fab.CD_FABRIC)}>
                  {fab.NM_FABRIC}
                </SelectItem>
              ))}
            </Select>
          )}

          <div className="flex gap-4">
            <DateRangePicker
              description="Selecione o período de vendas"
              label="Período"
              labelPlacement="inside"
              value={dataRange}
              variant="bordered"
              onChange={setDataRange}
            />
            <Tooltip showArrow content="Buscar vendas" delay={200} radius="sm">
              <Button
                className="mt-2 w-full"
                color="primary"
                isLoading={loading}
                startContent={<Search color="#fff" size={16} />}
                type="submit"
              >
                Buscar
              </Button>
            </Tooltip>
            <Tooltip showArrow content="Limpar seleção" delay={200} radius="sm">
              <Button
                className="mt-2 w-full"
                color="default"
                isDisabled={loading}
                startContent={<Eraser color="#5e5c64" size={16} />}
                variant="ghost"
                onPress={handleLimparFiltros}
              >
                Limpar
              </Button>
            </Tooltip>
          </div>
        </form>
      </div>
      <Tabs aria-label="Visualização de vendas" className="mt-4">
        <Tab key="produto" title="Por produto">
          <TabelaVendasPorProduto
            codigosFabricantes={Array.from(selecionados).map(String)}
            dataFim={dataRange?.end?.toString()}
            dataInicio={dataRange?.start?.toString()}
            loading={loading}
            pagina={pagina}
            porPagina={porPagina}
            setPagina={setPagina}
            vendas={vendasPorProduto}
          />
        </Tab>

        <Tab key="loja" title="Por loja">
          <TabelaVendasPorLoja
            codigosFabricantes={Array.from(selecionados).map(String)}
            dataFim={dataRange?.end?.toString()}
            dataInicio={dataRange?.start?.toString()}
            loading={loading}
            pagina={pagina}
            porPagina={porPagina}
            setPagina={setPagina}
            vendas={vendasPorLoja}
          />
        </Tab>
      </Tabs>
    </DefaultLayout>
  );
}

export default withRoleProtection(FornecedorVendas, ["fornecedor", "admin"]);
