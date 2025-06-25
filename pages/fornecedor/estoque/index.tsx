"use client";

import { useEffect, useState } from "react";
import { Button, Checkbox, Tab, Tabs } from "@heroui/react";

import { withRoleProtection } from "@/hoc/withRoleProtection";
import DefaultLayout from "@/layouts/default";
import { IFabricante } from "@/modules/fornecedor/types/fabricante.interface";
import { FornecedorService } from "@/modules/fornecedor/fornecedor.service";
import { useAuth } from "@/hooks/use-auth";
import { TabelaEstoquePorProduto } from "@/modules/estoque/components/tabelaEstoquePorProduto";
import { TabelaEstoquePorLoja } from "@/modules/estoque/components/tabelaEstoquePorLoja";
import { IEstoque } from "@/modules/estoque/types/estoque.interface";
import { EstoqueService } from "@/modules/estoque/estoque.service";

function FornecedorEstoque() {
  const { user } = useAuth();
  const [fabricantes, setFabricantes] = useState<IFabricante[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);

  const [estoque, setEstoque] = useState<IEstoque[]>([]);
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

  const toggleFabricante = (codigo: number) => {
    setSelecionados((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setEstoque([]);

    try {
      const resposta = await EstoqueService.consultarEstoque(
        selecionados.map(String)
      );

      setEstoque(resposta);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <h1 className="text-4xl text-zinc-700 font-bold">ESTOQUE</h1>
      <p className="text-sm text-slate-500">
        Exibição de estoque com dados agrupados por produto e por loja
      </p>
      <div className="flex flex-col w-full p-4 mt-8 gap-4 items-center justify-center bg-zinc-100 rounded-xl">
        <h2 className="text-lg font-bold text-slate-700">
          Selecione um fabricante
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
            <Button color="primary" isLoading={loading} type="submit">
              Selecionar
            </Button>
          </div>
        </form>
      </div>
      <Tabs aria-label="Visualização de estoque" className="mt-8">
        <Tab key="produto" title="Por produto">
          <TabelaEstoquePorProduto
            estoque={estoque}
            loading={loading}
            pagina={pagina}
            porPagina={porPagina}
            setPagina={setPagina}
          />
        </Tab>

        <Tab key="loja" title="Por loja">
          <TabelaEstoquePorLoja
            estoque={estoque}
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
