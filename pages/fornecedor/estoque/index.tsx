"use client";
import type { Selection } from "@heroui/react";

import { useEffect, useState } from "react";
import {
  addToast,
  Button,
  Divider,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Tooltip,
} from "@heroui/react";
import { Eraser, Search } from "lucide-react";

import { withRoleProtection } from "@/hoc/withRoleProtection";
import DefaultLayout from "@/layouts/default";
import { IFabricante } from "@/modules/fornecedor/types/fabricante.interface";
import { FornecedorService } from "@/modules/fornecedor/fornecedor.service";
import { useAuth } from "@/hooks/use-auth";
import { TabelaEstoquePorProduto } from "@/modules/fornecedor/estoque/components/tabelaEstoquePorProduto";
import { TabelaEstoquePorLoja } from "@/modules/fornecedor/estoque/components/tabelaEstoquePorLoja";
import { IEstoqueAgrupado } from "@/modules/fornecedor/estoque/types/estoqueAgrupado.interface";
import { EstoqueService } from "@/modules/fornecedor/estoque/estoque.service";

function FornecedorEstoque() {
  const { user } = useAuth();
  const [fabricantes, setFabricantes] = useState<IFabricante[]>([]);
  const [selecionados, setSelecionados] = useState<Selection>(new Set([]));

  const [estoqueAgrupado, setEstoqueAgrupado] = useState<IEstoqueAgrupado[]>(
    []
  );
  const [estoquePorFilial, setEstoquePorFilial] = useState<IEstoqueAgrupado[]>(
    []
  );
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

    const selecionadosArray = Array.from(selecionados);

    if (selecionadosArray.length === 0) {
      addToast({
        title: "Seleção obrigatória",
        description:
          "Selecione pelo menos um fabricante para consultar o estoque.",
        color: "danger",
      });

      return;
    }

    setLoading(true);
    setEstoqueAgrupado([]);

    try {
      const respostaAgrupados = await EstoqueService.consultarEstoque(
        selecionadosArray.map(String)
      );

      const respostaPorFilial = await EstoqueService.consultarEstoquePorFilial(
        selecionadosArray.map(String)
      );

      setEstoqueAgrupado(respostaAgrupados);
      setEstoquePorFilial(respostaPorFilial);

      if (respostaAgrupados.length === 0) {
        addToast({
          title: "Nenhum resultado encontrado",
          description:
            "Não há dados de estoque para os fabricantes selecionados.",
        });
      } else {
        addToast({
          title: "Consulta concluída",
          description: `Foram encontrados ${respostaAgrupados.length} registros de estoque.`,
          color: "default",
        });
      }
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.mensagem ||
        err?.mensagem ||
        "Erro ao consultar o estoque.";
      const detalhe =
        err?.response?.data?.detalhe || "Tente novamente mais tarde.";

      addToast({
        title: mensagem,
        description: detalhe,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLimparFiltros = () => {
    setSelecionados(new Set([]));
    setEstoqueAgrupado([]);
    setPagina(1);

    addToast({
      title: "Filtros limpos",
      description: "A seleção de fabricantes foi resetada.",
    });
  };

  return (
    <DefaultLayout>
      <h1 className="text-4xl text-zinc-800 font-bold">ESTOQUE</h1>
      <p className="text-sm text-slate-500">
        Exibição de estoque com dados agrupados por produto e por loja
      </p>
      <Divider className="my-6" />
      <div className="flex flex-col w-full gap-4 items-start justify-center rounded-xl">
        <form className="flex gap-4 items-center" onSubmit={handleSubmit}>
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
              <SelectItem key={fab.CD_FABRIC}>{fab.NM_FABRIC}</SelectItem>
            ))}
          </Select>
          <div className="flex mb-6 gap-4">
            <Tooltip showArrow content="Buscar estoque" delay={200} radius="sm">
              <Button
                className="w-full"
                color="primary"
                isLoading={loading}
                startContent={<Search size={16} />}
                type="submit"
              >
                Buscar
              </Button>
            </Tooltip>

            <Tooltip showArrow content="Limpar seleção" delay={200} radius="sm">
              <Button
                className="w-full"
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
      <Tabs aria-label="Visualização de estoque" className="mt-4">
        <Tab key="produto" title="Por produto">
          <TabelaEstoquePorProduto
            codigosFabricantes={Array.from(selecionados).map(String)}
            estoque={estoqueAgrupado}
            loading={loading}
            pagina={pagina}
            porPagina={porPagina}
            setPagina={setPagina}
          />
        </Tab>

        <Tab key="loja" title="Por loja">
          <TabelaEstoquePorLoja
            codigosFabricantes={Array.from(selecionados).map(String)}
            estoque={estoquePorFilial}
            loading={loading}
            pagina={pagina}
            porPagina={porPagina}
            setPagina={setPagina}
          />
        </Tab>
      </Tabs>
    </DefaultLayout>
  );
}

export default withRoleProtection(FornecedorEstoque, ["fornecedor"]);
