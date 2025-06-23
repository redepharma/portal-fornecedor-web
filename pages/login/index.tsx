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
import { LogIn } from "lucide-react";
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
        description: "Redirecionando...",
        color: "success",
      });

      router.push("/");
    } catch (err: any) {
      const msg = err.message || "Erro inesperado ao autenticar.";

      setErro(msg);

      addToast({
        title: "Erro ao autenticar",
        description: msg,
        color: "danger",
      });
    } finally {
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

          {erro && (
            <div className="text-sm text-red-500 text-center mt-1">{erro}</div>
          )}

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
