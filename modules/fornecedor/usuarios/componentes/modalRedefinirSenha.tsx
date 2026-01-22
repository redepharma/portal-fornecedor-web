"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  useDisclosure,
  addToast,
  Tooltip,
} from "@heroui/react";
import { useState } from "react";
import { KeyRound, CircleX, Eye, EyeOff } from "lucide-react";

import { alterarSenhaUsuario } from "../usuarios.service";
import { IUsuario } from "../types/usuario.interface";

/**
 * Componente modal para redefinição de senha do usuário.
 *
 * Controla estado da nova senha, visibilidade do input,
 * valida tamanho mínimo, gerencia envio e exibe toasts para sucesso ou erro.
 *
 * @param {{ usuario: IUsuario }} props - Propriedades do componente.
 * @returns {JSX.Element} Modal para alterar senha do usuário.
 */
export function ModalRedefinirSenha({ usuario }: { usuario: IUsuario }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (senha.trim().length < 6) {
      addToast({
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 6 caracteres.",
        color: "warning",
      });

      return;
    }

    setLoading(true);
    try {
      await alterarSenhaUsuario(usuario.id, senha);
      onClose();
      addToast({
        title: "Senha alterada",
        description: "A nova senha foi definida com sucesso.",
        color: "success",
      });
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.message?.join?.("\n") ||
        err?.response?.data?.mensagem ||
        err?.message ||
        "Erro ao alterar a senha.";

      addToast({
        title: "Erro ao alterar senha",
        description: mensagem,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="light" onPress={onOpen}>
        <KeyRound className="w-4 h-4" />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          onOpenChange();
          if (!isOpen) {
            setSenha("");
            setMostrarSenha(false);
          }
        }}
      >
        <ModalContent>
          {(onCloseInterno) => (
            <>
              <ModalHeader>Trocar senha</ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  endContent={
                    <div className="flex items-center gap-1">
                      {senha && (
                        <Tooltip
                          showArrow
                          content="Limpar senha"
                          delay={200}
                          radius="sm"
                        >
                          <CircleX
                            className="cursor-pointer"
                            color="#5e5c64"
                            size={16}
                            onClick={() => setSenha("")}
                          />
                        </Tooltip>
                      )}
                      {mostrarSenha ? (
                        <Tooltip
                          showArrow
                          content="Ocultar senha"
                          delay={200}
                          radius="sm"
                        >
                          <EyeOff
                            className="cursor-pointer"
                            color="#5e5c64"
                            size={16}
                            onClick={() => setMostrarSenha(false)}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          showArrow
                          content="Mostrar senha"
                          delay={200}
                          radius="sm"
                        >
                          <Eye
                            className="cursor-pointer"
                            color="#5e5c64"
                            size={16}
                            onClick={() => setMostrarSenha(true)}
                          />
                        </Tooltip>
                      )}
                    </div>
                  }
                  label="Nova senha"
                  placeholder="Digite a nova senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
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
                  startContent={<KeyRound size={14} />}
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
