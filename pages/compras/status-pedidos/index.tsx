import { useCallback, useEffect, useState } from "react";
import { addToast } from "@heroui/react";

import DefaultLayout from "@/layouts/default";
import { MultigiroStatusService } from "@/modules/pedidos-api/pedidos/status-pedido.service";
import { TabelaStatusPedidos } from "@/modules/compras/status-pedido/components/tabela-status-pedidos";
import { IStatusPedidoMultigiro } from "@/modules/compras/status-pedido/types/status-pedido.interface";

export default function StatusPedidoPage() {
  const [dados, setDados] = useState<IStatusPedidoMultigiro[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const porPagina = 20;

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await MultigiroStatusService.listar();

      setDados(res);
    } catch (e) {
      addToast({
        title: "Erro ao carregar status dos pedidos",
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
