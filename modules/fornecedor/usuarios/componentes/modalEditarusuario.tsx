/* eslint-disable prettier/prettier */
"use client";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button, Input, Select, SelectItem, useDisclosure, addToast } from "@heroui/react";
import { useState } from "react";
import { CircleX, Pencil } from "lucide-react";

import { atualizarUsuario } from "../usuarios.service";
import { UpdateUsuarioDto } from "../types/updateUsuario.dto";
import { IUsuario } from "../types/usuario.interface";

import { TagInput } from "@/components/tag-input";

const tiposUsuario = ["Fornecedor", "Comprador"];

/**
 * Componente modal para edição dos dados de um usuário existente.
 *
 * Controla formulário com campos de nome, username, códigos do fabricante (tags)
 * e tipo de usuário. Gerencia envio, exibe toasts de sucesso e erro,
 * e carrega dados do usuário ao abrir.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {IUsuario} props.usuario - Usuário a ser editado.
 * @param {() => void} props.aoFechar - Callback executado após fechamento do modal.
 * @returns {JSX.Element} Modal para edição do usuário.
 */
export function ModalEditarUsuario({ usuario, aoFechar }: { usuario: IUsuario; aoFechar: () => void }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [form, setForm] = useState<UpdateUsuarioDto>({
    nome: "",
    username: "",
    codigoInterno: "",
    roles: "fornecedor",
  });
  const [loading, setLoading] = useState(false);
  const [codigoPendente, setCodigoPendente] = useState("");

  const abrirModal = () => {
    setForm({
      nome: usuario.nome,
      username: usuario.username,
      codigoInterno: usuario.codigoInterno || "",
      roles: usuario.roles,
    });
    onOpen();
  };

  const handleChange = (field: keyof UpdateUsuarioDto, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (codigoPendente.trim() !== "") {
      addToast({
        title: "Código não adicionado",
        description:
          "Você digitou um código de fabricante, mas não pressionou Enter para adicioná-lo.",
        color: "warning",
      });
      setLoading(false);

      return;
    }

    try {
      await atualizarUsuario(usuario.id, form);
      onClose();
      aoFechar();

      addToast({
        title: "Usuário atualizado",
        description: "As informações foram salvas com sucesso.",
        color: "success",
      });
    } catch (err) {
      const mensagem =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro inesperado, tente novamente mais tarde.";

      addToast({
        title: "Erro ao atualizar usuário",
        description: mensagem,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="light" onPress={abrirModal}>
        <Pencil className="w-4 h-4" />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onCloseInterno) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar usuário
              </ModalHeader>
              <ModalBody className="space-y-2">
                <Input
                  isRequired
                  label="Nome"
                  value={form.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                />
                <Input
                  isRequired
                  label="Username (login)"
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
                <TagInput
                  label="Código(s) do(s) fabricante(s)"
                  placeholder="Digite e pressione enter"
                  value={form.codigoInterno || ""}
                  onChange={(value) => handleChange("codigoInterno", value)}
                  onInputValueChange={(input) => setCodigoPendente(input)}
                />
                <Select
                  label="Tipo de usuário"
                  selectedKeys={new Set([form.roles || "fornecedor"])}
                  onSelectionChange={(keys) => {
                    const selected =
                      typeof keys === "string" ? keys : Array.from(keys)[0];

                    handleChange("roles", selected.toString());
                  }}
                >
                  {tiposUsuario.map((tipo) => (
                    <SelectItem key={tipo.toLowerCase()}>{tipo}</SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  startContent={<CircleX size={14} />}
                  variant="light"
                  onPress={onCloseInterno}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  isLoading={loading}
                  startContent={<Pencil size={14} />}
                  onPress={handleSubmit}
                >
                  Salvar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
