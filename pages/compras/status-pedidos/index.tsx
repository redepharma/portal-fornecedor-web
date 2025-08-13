import {
  Divider,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useRef, useState } from "react";

import DefaultLayout from "@/layouts/default";
import { IStatusPedido } from "@/modules/compras/status-pedido/types/status-pedido.interface";

export default function IndexPage() {
  const [pedidos, setPedidos] = useState<IStatusPedido[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DefaultLayout>
      <h1 className="text-4xl font-bold text-zinc-800">Status Pedido</h1>
      <Divider className="my-4" />
      <div className="flex flex-col gap-2 mt-4">
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto"
          style={{ height: "300px" }}
        >
          <Table
            isCompact
            isStriped
            aria-label="Tabela de status de pedidos"
            className="max-h-[280px] text-neutral-700 p-1"
          >
            <TableHeader>
              <TableColumn key="seqPedido" allowsSorting>
                SEQPEDIDO
              </TableColumn>
              <TableColumn key="loja" allowsSorting>
                LOJA
              </TableColumn>
              <TableColumn key="statusIntegracao" allowsSorting>
                STATUS INTEGRAÇÃO
              </TableColumn>
              <TableColumn key="nroPedVenda" allowsSorting>
                Nº PEDIDO DA VENDA
              </TableColumn>
            </TableHeader>

            <TableBody
              emptyContent="Sem dados para exibir."
              items={pedidos}
              loadingContent={<Spinner label="Carregando..." />}
              loadingState={isLoading ? "loading" : "idle"}
            >
              {(pedido: IStatusPedido) => (
                <TableRow key={pedido.seqpedido}>
                  <TableCell>{pedido.seqpedido}</TableCell>
                  <TableCell>{pedido.nroEmpresa}</TableCell>
                  <TableCell>{pedido.statusIntegracao}</TableCell>
                  <TableCell>{pedido.nroPedVenda}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DefaultLayout>
  );
}
