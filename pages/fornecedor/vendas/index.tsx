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
} from "@heroui/react";
import { DateValue } from "@internationalized/date";
import { Select, SelectItem } from "@heroui/react";
import { Search } from "lucide-react";

import { VendaService } from "@/modules/vendas/vendas.service";
import { withRoleProtection } from "@/hoc/withRoleProtection";
import DefaultLayout from "@/layouts/default";
import { IFabricante } from "@/modules/fornecedor/types/fabricante.interface";
import { FornecedorService } from "@/modules/fornecedor/fornecedor.service";
import { IVendaComEAN } from "@/modules/vendas/types/vendaComEan.interface";
import { useAuth } from "@/hooks/use-auth";
import { TabelaVendasPorProduto } from "@/modules/vendas/components/tabelaVendasPorProduto";
import { TabelaVendasPorLoja } from "@/modules/vendas/components/tabelaVendasPorLoja";

function FornecedorVendas() {
  const { user } = useAuth();
  const [fabricantes, setFabricantes] = useState<IFabricante[]>([]);
  const [selecionados, setSelecionados] = useState<Selection>(new Set([]));
  const [dataRange, setDataRange] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>(null);

  const [vendas, setVendas] = useState<IVendaComEAN[]>([]);
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
    setVendas([]);

    const dataInicio = dataRange.start.toString();
    const dataFim = dataRange.end.toString();

    try {
      const resultados: IVendaComEAN[] = [];
      const codigos = Array.from(selecionados) as string[];

      for (const codigo of codigos) {
        const resposta = await VendaService.consultarVendas({
          codigoFabricante: String(codigo),
          dataInicio,
          dataFim,
        });

        resultados.push(...resposta);
      }

      setVendas(resultados);
      setPagina(1);

      if (resultados.length === 0) {
        addToast({
          title: "Nenhum dado encontrado",
          description: "Não foram encontradas vendas no período informado.",
        });
      } else {
        addToast({
          title: "Consulta realizada com sucesso",
          description: `Foram encontradas ${resultados.length} vendas.`,
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
              selectionMode="multiple"
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
            <Button
              className="mt-2 w-full"
              color="primary"
              isLoading={loading}
              startContent={<Search color="#fff" size={16} />}
              type="submit"
            >
              Buscar
            </Button>
          </div>
        </form>
      </div>
      <Tabs aria-label="Visualização de vendas" className="mt-4">
        <Tab key="produto" title="Por produto">
          <TabelaVendasPorProduto
            loading={loading}
            pagina={pagina}
            porPagina={porPagina}
            setPagina={setPagina}
            vendas={vendas}
          />
        </Tab>

        <Tab key="loja" title="Por loja">
          <TabelaVendasPorLoja
            loading={loading}
            pagina={pagina}
            porPagina={porPagina}
            setPagina={setPagina}
            vendas={vendas}
          />
        </Tab>
      </Tabs>
    </DefaultLayout>
  );
}

export default withRoleProtection(FornecedorVendas, ["fornecedor"]);
