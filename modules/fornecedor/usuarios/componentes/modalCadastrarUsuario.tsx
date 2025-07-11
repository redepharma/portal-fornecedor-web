"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import { CircleX, Plus } from "lucide-react";

import { criarUsuario } from "../usuarios.service";
import { CriarUsuarioDto } from "../types/criarUsuario.dto";

import { TagInput } from "@/components/tag-input";

const tiposUsuario = ["Fornecedor", "Comprador"];

/**
 * Componente modal para cadastro de um novo usuário.
 *
 * Contém formulário controlado com campos de nome, username, senha,
 * códigos do fabricante (tags) e tipo de usuário.
 * Controla envio, exibe toasts para sucesso e erro, e reseta formulário ao abrir.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {() => void} props.aoFechar - Função callback chamada após o fechamento do modal.
 * @returns {JSX.Element} Modal com formulário para cadastrar usuário.
 */
export function ModalCadastrarUsuario({ aoFechar }: { aoFechar: () => void; aberto: boolean }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [form, setForm] = useState<CriarUsuarioDto>({
    nome: "",
    username: "",
    senha: "",
    codigoInterno: "",
    roles: "fornecedor",
  });
  const [loading, setLoading] = useState(false);
  const [codigoPendente, setCodigoPendente] = useState("");

  const handleChange = (field: keyof CriarUsuarioDto, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const abrirModal = () => {
    setForm({
      nome: "",
      username: "",
      senha: "",
      codigoInterno: "",
      roles: "fornecedor",
    });
    setCodigoPendente("");
    onOpen();
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
      await criarUsuario(form);
      onClose();
      aoFechar();

      addToast({
        title: "Usuário cadastrado",
        description: "O novo usuário foi criado com sucesso.",
        color: "success",
      });
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.message?.join?.("\n") ||
        err?.response?.data?.mensagem ||
        err?.message ||
        "Ocorreu um erro inesperado, tente novamente mais tarde.";

      addToast({
        title: "Erro ao cadastrar usuário",
        description: mensagem,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="max-w-fit w-full"
        color="primary"
        size="sm"
        startContent={<Plus size={16} />}
        onPress={abrirModal}
      >
        Novo Usuário
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onCloseInterno) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cadastrar novo usuário
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
                <Input
                  isRequired
                  label="Senha"
                  type="password"
                  value={form.senha}
                  onChange={(e) => handleChange("senha", e.target.value)}
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
                  selectedKeys={[form.roles]}
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
                  startContent={<Plus size={14} />}
                  onPress={handleSubmit}
                >
                  Cadastrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
