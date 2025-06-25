"use client";
import type { Selection } from "@heroui/react";

import { useEffect, useState } from "react";
import { Button, Divider, Select, SelectItem, Tab, Tabs } from "@heroui/react";
import { Search } from "lucide-react";

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
  const [selecionados, setSelecionados] = useState<Selection>(new Set([]));

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setEstoque([]);

    try {
      const resposta = await EstoqueService.consultarEstoque(
        Array.from(selecionados).map(String)
      );

      setEstoque(resposta);
    } finally {
      setLoading(false);
    }
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
          <div className="mb-6">
            <Button
              color="primary"
              isLoading={loading}
              startContent={<Search size={16} />}
              type="submit"
            >
              Buscar
            </Button>
          </div>
        </form>
      </div>
      <Tabs aria-label="Visualização de estoque" className="mt-4">
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
