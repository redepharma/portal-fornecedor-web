"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
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

  const handleLogin = async () => {
    setErro("");

    try {
      await login(username, senha);
      router.push("/"); // Redireciona para home após login
    } catch (err: any) {
      console.error("Erro ao logar:", err);
      setErro(err.message || "Erro inesperado ao autenticar.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full border bg-white shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <LogIn className="mx-auto text-primary" size={36} />
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
            isLoading={status === "loading"}
            onPress={handleLogin}
          >
            Entrar
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
