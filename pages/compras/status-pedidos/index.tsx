import { useCallback, useEffect, useState } from "react";
import { addToast } from "@heroui/react";

import DefaultLayout from "@/layouts/default";
import { TabelaStatusPedidos } from "@/modules/compras/status-pedido/components/tabela-status-pedidos";
import { IStatusPedidoMultigiro } from "@/modules/compras/status-pedido/types/status-pedido.interface";
import { MultigiroStatusService } from "@/modules/pedidos-api/pedidos/status-pedido.service";

export default function StatusPedidoPage() {
  const [dados, setDados] = useState<IStatusPedidoMultigiro[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const porPagina = 20;

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const { ok, falhas, httpStatus } =
        await MultigiroStatusService.listarStatusPedidos();

      setDados(ok ?? []);

      // feedbacks:
      if (httpStatus === 204) {
        addToast({ title: "Sem dados para exibir.", color: "warning" });
      }

      if (falhas?.length) {
        const qtd = falhas.length;
        const exemplos = falhas
          .slice(0, 3)
          .map((f) => f.message)
          .join(" | ");

        addToast({
          title: `${qtd} falha(s) ao consultar status`,
          description: exemplos,
          color: httpStatus === 502 ? "danger" : "warning",
        });
      }
    } catch (e: any) {
      addToast({
        title: "Erro ao carregar status dos pedidos",
        description: e?.message,
        color: "danger",
      });
      setDados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <DefaultLayout>
      <TabelaStatusPedidos
        dados={dados}
        loading={loading}
        pagina={pagina}
        porPagina={porPagina}
        setPagina={setPagina}
        titulo="Status Pedido"
        onRefresh={carregar}
      />
    </DefaultLayout>
  );
}
