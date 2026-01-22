"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
} from "@heroui/react";
import { Trash2 } from "lucide-react";

import { ModalRedefinirSenha } from "./modalRedefinirSenha";

import { IUsuario } from "@/modules/fornecedor/usuarios/types/usuario.interface";
import { ModalEditarUsuario } from "@/modules/fornecedor/usuarios/componentes/modalEditarusuario";

interface UsuarioTableProps {
  usuarios: IUsuario[];
  onExcluir: (id: number) => void;
  onAtualizar: () => void;
}

/**
 * Componente que exibe uma tabela de usuários com opções para editar,
 * redefinir senha e excluir.
 *
 * @param {UsuarioTableProps} props - Propriedades do componente.
 * @returns {JSX.Element} Tabela de usuários com ações.
 */
export function UsuarioTable({
  usuarios,
  onExcluir,
  onAtualizar,
}: UsuarioTableProps) {
  return (
    <Table
      isHeaderSticky
      isStriped
      className="max-h-[600px] overflow-y-auto rounded-2xl"
      maxTableHeight={600}
    >
      <TableHeader>
        <TableColumn>Nome</TableColumn>
        <TableColumn>Login</TableColumn>
        <TableColumn>Fabricante(s)</TableColumn>
        <TableColumn className="text-center">Tipo</TableColumn>
        <TableColumn className="text-center">Ações</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={usuarios.length === 0 ? "Sem resultados" : undefined}
      >
        {usuarios.map((usuario) => (
          <TableRow key={usuario.id}>
            <TableCell>{usuario.nome}</TableCell>
            <TableCell>{usuario.username}</TableCell>
            <TableCell>{usuario.codigoInterno}</TableCell>
            <TableCell className="text-center">{usuario.roles}</TableCell>
            <TableCell className="space-x-2 text-center">
              <Tooltip
                showArrow
                content="Editar usuário"
                delay={300}
                radius="sm"
              >
                <span>
                  <ModalEditarUsuario
                    aoFechar={onAtualizar}
                    usuario={usuario}
                  />
                </span>
              </Tooltip>
              <Tooltip showArrow content="Trocar senha" delay={300} radius="sm">
                <span>
                  <ModalRedefinirSenha usuario={usuario} />
                </span>
              </Tooltip>

              <Tooltip
                showArrow
                content="Excluir usuário"
                delay={300}
                radius="sm"
              >
                <Button
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => onExcluir(usuario.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
