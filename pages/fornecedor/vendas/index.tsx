"use client";

import { useEffect, useState } from "react";
import { Button, Checkbox, DateRangePicker, Tab, Tabs } from "@heroui/react";
import { DateValue } from "@internationalized/date";

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
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [dataRange, setDataRange] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>(null);

  const [vendas, setVendas] = useState<IVendaComEAN[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagina, setPagina] = useState(1);
  const porPagina = 10;
  const totalPaginas = Math.ceil(vendas.length / porPagina);

  useEffect(() => {
    if (!user?.codigoInterno) return;

    const codigos: number[] = user.codigoInterno
      .split(",")
      .map((codigo) => parseInt(codigo, 10))
      .filter((c) => !isNaN(c)); // garante que só números válidos entrem

    FornecedorService.listarFabricantes(codigos).then(setFabricantes);
  }, [user?.codigoInterno]);

  const toggleFabricante = (codigo: number) => {
    setSelecionados((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataRange?.start || !dataRange?.end) return;

    setLoading(true);
    setVendas([]);

    const dataInicio = dataRange.start.toString();
    const dataFim = dataRange.end.toString();

    const resultados: IVendaComEAN[] = [];

    for (const codigo of selecionados) {
      const resposta = await VendaService.consultarVendas({
        codigoFabricante: String(codigo),
        dataInicio,
        dataFim,
      });

      resultados.push(...resposta);
    }

    setVendas(resultados);
    setPagina(1);
    setLoading(false);
  };

  const vendasPaginadas = vendas.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  return (
    <DefaultLayout>
      <h1 className="text-4xl text-zinc-700 font-bold">VENDAS</h1>
      <p className="text-sm text-slate-500">
        Exibição de vendas por período, agrupadas por produto e por loja
      </p>
      <div className="flex flex-col w-full p-4 mt-8 gap-4 items-center justify-center bg-zinc-100 rounded-xl">
        <h2 className="text-lg font-bold text-slate-700">
          Selecione um fabricante e um período
        </h2>
        <form
          className="flex flex-col gap-2 items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            {fabricantes.map((fab) => (
              <Checkbox
                key={fab.CD_FABRIC}
                checked={selecionados.includes(fab.CD_FABRIC)}
                onChange={() => toggleFabricante(fab.CD_FABRIC)}
              >
                {fab.NM_FABRIC}
              </Checkbox>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <DateRangePicker value={dataRange} onChange={setDataRange} />
            <Button color="primary" isLoading={loading} type="submit">
              Selecionar
            </Button>
          </div>
        </form>
      </div>
      <Tabs aria-label="Visualização de vendas" className="mt-8">
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
