"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Tooltip,
} from "@heroui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { CircleX, Eye, EyeOff, LogIn } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Head } from "@/layouts/head";

/**
 * Página de login do sistema.
 * Permite que o usuário informe nome e senha para autenticação.
 * Exibe feedbacks via toasts para sucesso, erros e validações.
 */
export default function LoginPage() {
  const { login, status } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Executa o processo de login chamando o hook de autenticação,
   * com validação básica de campos e feedback ao usuário.
   */
  const handleLogin = async () => {
    if (!username.trim() || !senha.trim()) {
      addToast({
        title: "Campos obrigatórios",
        description: "Informe seu usuário e senha para continuar.",
        color: "danger",
      });

      return;
    }

    setLoading(true);

    try {
      await login(username, senha);

      addToast({
        title: "Login realizado com sucesso!",
        color: "success",
      });

      router.push("/");
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.mensagem || err?.mensagem || "Erro ao autenticar.";
      const detalhe =
        err?.response?.data?.detalhe ||
        "Verifique suas credenciais e tente novamente.";

      addToast({
        title: mensagem,
        description: detalhe,
        color: "danger",
      });

      setLoading(false);
    }
  };

  return (
    <>
      <Head />
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 gap-4"
        style={{
          backgroundImage: 'url("/login-bg.png")',
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      >
        <div className="max-w-xs w-full p-4 border bg-white shadow-xl rounded-2xl text-center">
          <img alt="logo" className="mx-auto w-44" src="/logo.png" />
        </div>
        <Card className="max-w-xs w-full p-4 border bg-white shadow-xl rounded-2xl">
          <CardHeader className="flex flex-col items-start">
            <h1 className="text-2xl font-semibold text-slate-800">
              Entrar no sistema
            </h1>
            <p className="text-sm text-slate-500">
              Informe suas credenciais abaixo
            </p>
          </CardHeader>

          <CardBody className="space-y-4">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <Input
                required
                endContent={
                  username && (
                    <Tooltip
                      showArrow
                      content="Limpar usuário"
                      delay={200}
                      radius="sm"
                    >
                      <CircleX
                        className="cursor-pointer"
                        color="#5e5c64"
                        size={16}
                        onClick={() => setUsername("")}
                      />
                    </Tooltip>
                  )
                }
                label="Usuário"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                required
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
                label="Senha"
                placeholder="Digite sua senha"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <Button
                className="w-full"
                color="primary"
                disabled={loading}
                isLoading={loading}
                startContent={<LogIn size={16} />}
                type="submit"
              >
                Entrar
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
