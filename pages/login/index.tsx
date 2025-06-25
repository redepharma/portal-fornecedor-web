"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "@heroui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { CircleX, Eye, EyeOff, LogIn } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Head } from "@/layouts/head";

export default function LoginPage() {
  const { login, status } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // ⚠️ Validação básica
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
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
                    <CircleX
                      className="cursor-pointer"
                      color="#5e5c64"
                      size={16}
                      onClick={() => setUsername("")}
                    />
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
                      <CircleX
                        className="cursor-pointer"
                        color="#5e5c64"
                        size={16}
                        onClick={() => setSenha("")}
                      />
                    )}
                    {mostrarSenha ? (
                      <EyeOff
                        className="cursor-pointer"
                        color="#5e5c64"
                        size={16}
                        onClick={() => setMostrarSenha(false)}
                      />
                    ) : (
                      <Eye
                        className="cursor-pointer"
                        color="#5e5c64"
                        size={16}
                        onClick={() => setMostrarSenha(true)}
                      />
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
