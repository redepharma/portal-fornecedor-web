import {
  Button,
  Checkbox,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { CirclePlus } from "lucide-react";
import { useRef } from "react";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <DefaultLayout>
      <div className="flex flex-col justify-between ">
        <h1 className="text-4xl text-zinc-800 font-bold">PEDIDOS</h1>
        <p className="text-sm text-slate-500">
          Solicitação de pedidos de compra
        </p>
        <Divider className="my-4" />
        <div ref={scrollContainerRef} className="h-60 overflow-y-auto">
          <div className="flex flex-row justify-between items-center gap-4 py-1">
            <Input label="Código" />
            <Select label="Fornecedor">
              <SelectItem>TESTE</SelectItem>
            </Select>
            <Checkbox>Option</Checkbox>
            <Button
              className="bg-transparent my-2"
              size="sm"
              type="button"
              variant="flat"
            >
              <CirclePlus color="#f05411" />
            </Button>
          </div>
        </div>

        {/* Tabela de erros */}
        <div className="flex flex-col gap-2 mt-4">
          <Divider className="my-1" />
          <h2 className="text-2xl text-zinc-800 font-bold ">ERROS</h2>
          <div
            ref={scrollContainerRef}
            className="overflow-y-auto"
            style={{ height: "300px" }}
          >
            <Table
              isCompact
              isStriped
              aria-label="Tabela de erros"
              className="max-h-[280px] text-neutral-700 p-1"
              style={{ height: "280px" }}
            >
              <TableHeader>
                <TableColumn key="numeroPedido" allowsSorting>
                  NÚMERO DO PEDIDO
                </TableColumn>
                <TableColumn key="loja" allowsSorting>
                  LOJA
                </TableColumn>
                <TableColumn key="produto" allowsSorting>
                  PRODUTO
                </TableColumn>
                <TableColumn key="erro" allowsSorting>
                  ERRO
                </TableColumn>
              </TableHeader>

              <TableBody
                emptyContent="Sem dados para exibir."
                loadingContent={<Spinner label="Carregando..." />}
              >
                <TableRow>
                  <TableCell>TESTE</TableCell>
                  <TableCell>TESTE</TableCell>
                  <TableCell>TESTE</TableCell>
                  <TableCell>TESTE</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>TESTE</TableCell>
                  <TableCell>TESTE</TableCell>
                  <TableCell>TESTE</TableCell>
                  <TableCell>TESTE</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>2TESTE</TableCell>
                  <TableCell>1TESTE</TableCell>
                  <TableCell>2TESTE</TableCell>
                  <TableCell>TESTE</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2TESTE</TableCell>
                  <TableCell>1TESTE</TableCell>
                  <TableCell>2TESTE</TableCell>
                  <TableCell>TESTE</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2TESTE</TableCell>
                  <TableCell>1TESTE</TableCell>
                  <TableCell>2TESTE</TableCell>
                  <TableCell>TESTE</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
