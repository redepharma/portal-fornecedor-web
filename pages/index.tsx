import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/hooks/use-auth";

/**
 * Página inicial do Portal do Fornecedor.
 * Exibe mensagem de boas-vindas e descrição das principais funcionalidades para o usuário autenticado.
 */
export default function IndexPage() {
  const { user } = useAuth();

  return (
    <DefaultLayout>
      <div className="flex h-full items-center justify-center">
        <section className="flex flex-col items-center justify-center gap-4 p-10 max-w-3xl text-slate-800 bg-gray-100 rounded-2xl">
          <h1 className="text-2xl font-bold">
            Bem-vindo ao Portal do Fornecedor, <strong>{user?.nome}</strong>!
          </h1>

          <p className="text-lg">
            Simplifique o gerenciamento de seus estoques e acompanhe suas vendas
            de maneira eficiente. Com o{" "}
            <strong>Portal do Fornecedor Redepharma</strong>, oferecemos a você
            todas as ferramentas necessárias para agilizar suas operações.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            Recursos e Funcionalidades:
          </h2>

          <article className="text-left">
            <h3 className="font-semibold mt-4">
              1. Visualização e Download de Excel para Estoque:
            </h3>
            <p>
              - Acesse facilmente seus dados de estoque por meio de uma
              interface intuitiva.
              <br />
              <br />- Selecione os fabricantes com os quais você trabalha a
              partir de uma lista de opções e, em seguida, clique no botão{" "}
              <em>&quot;Buscar&quot;</em>. Em questão de segundos, você poderá
              exportar um arquivo Excel contendo todas as informações relevantes
              do seu estoque.
            </p>

            <h3 className="font-semibold mt-4">2. Consulta de Vendas:</h3>
            <p>
              - Acompanhe suas vendas de forma personalizada. Selecione os
              fabricantes com os quais você trabalha e defina um período
              específico para consulta (data inicial e final). <br />
              <br />- Clique no botão <em>&quot;Buscar&quot;</em>, você terá
              acesso aos dados detalhados das suas vendas nesse período,
              permitindo uma análise precisa e o auxílio na tomada de decisões
              estratégicas.
              <br />
              <br />- Esses dados podem ser exportados em formato Excel também.
            </p>
          </article>
        </section>
      </div>
    </DefaultLayout>
  );
}
