"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
} from "@heroui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { login, status } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErro("");

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

      setErro(mensagem);

      addToast({
        title: mensagem,
        description: detalhe,
        color: "danger",
      });

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-sm w-full p-4 border bg-white shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-start">
          <h1 className="text-2xl font-semibold text-slate-800">
            Entrar no sistema
          </h1>
          <p className="text-sm text-slate-500">
            Informe suas credenciais abaixo
          </p>
        </CardHeader>

        <CardBody className="space-y-4">
          <Input
            required
            label="Usuário"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            required
            label="Senha"
            placeholder="Digite sua senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Button
            className="w-full"
            color="primary"
            disabled={loading}
            isLoading={loading}
            onPress={handleLogin}
          >
            {loading ? <Spinner color="white" size="sm" /> : "Entrar"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
