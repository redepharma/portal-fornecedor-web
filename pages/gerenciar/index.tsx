"use client";

import { useEffect, useMemo, useState } from "react";
import { Input, Pagination, Spinner, Tooltip, addToast } from "@heroui/react";
import { CircleX, Search } from "lucide-react";

import DefaultLayout from "@/layouts/default";
import {
  listarUsuarios,
  removerUsuario,
} from "@/modules/gerenciar/usuarios.service";
import { IUsuario } from "@/modules/gerenciar/types/usuario.interface";
import { ModalCadastrarUsuario } from "@/modules/gerenciar/componentes/modalCadastrarUsuario";
import { UsuarioTable } from "@/modules/gerenciar/componentes/tabelaUsuarios";

export default function GerenciarUsuariosPage() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(10);
  const [filtro, setFiltro] = useState("");
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [filtro]);

  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      const lista = await listarUsuarios();

      setUsuarios(lista);
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.mensagem ||
        err?.message ||
        "Ocorreu um erro inesperado.";

      addToast({
        title: "Erro ao buscar usuários",
        description: mensagem,
        color: "danger",
      });
    } finally {
      setCarregando(false);
    }
  };

  const excluirUsuario = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await removerUsuario(id);
        carregarUsuarios();
        addToast({
          title: "Usuário excluído",
          description: "O usuário foi removido com sucesso.",
          color: "success",
        });
      } catch (err: any) {
        const mensagem =
          err?.response?.data?.mensagem ||
          err?.message ||
          "Erro ao excluir usuário.";

        addToast({
          title: "Erro",
          description: mensagem,
          color: "danger",
        });
      }
    }
  };

  const usuariosFiltrados = useMemo(() => {
    const termo = filtro.toLowerCase();

    return usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(termo) ||
        u.username.toLowerCase().includes(termo)
    );
  }, [usuarios, filtro]);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / porPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  return (
    <DefaultLayout>
      <div>
        <h2 className="text-4xl text-zinc-800 font-bold mb-4">
          Gerenciar Usuários
        </h2>

        <div className="flex flex-row-reverse justify-between">
          <div className="flex items-center gap-4 max-w-md">
            <Input
              endContent={
                filtro && (
                  <Tooltip showArrow content="Limpar" delay={200} radius="sm">
                    <CircleX
                      className="cursor-pointer"
                      size={14}
                      onClick={() => setFiltro("")}
                    />
                  </Tooltip>
                )
              }
              placeholder="Buscar por nome ou login"
              size="sm"
              startContent={<Search size={14} />}
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <ModalCadastrarUsuario
              aberto={modalCadastroAberto}
              aoFechar={() => {
                setModalCadastroAberto(false);
                carregarUsuarios();
              }}
            />
          </div>
          <p className="text-sm text-zinc-600">
            Exibindo{" "}
            {usuariosFiltrados.length === 0 ? 0 : (pagina - 1) * porPagina + 1}–
            {(pagina - 1) * porPagina + usuariosPaginados.length} de{" "}
            {usuariosFiltrados.length} resultados
          </p>
        </div>

        {carregando ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <UsuarioTable
              usuarios={usuariosPaginados}
              onAtualizar={carregarUsuarios}
              onExcluir={excluirUsuario}
            />

            {totalPaginas > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  showControls
                  page={pagina}
                  total={totalPaginas}
                  onChange={setPagina}
                />
              </div>
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
