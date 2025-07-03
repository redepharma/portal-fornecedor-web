"use client";

import { Ghost } from "lucide-react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useRouter } from "next/router";

/**
 * Página exibida quando a rota não é encontrada (404).
 * Exibe mensagem amigável e botão para voltar à página inicial.
 */
export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full shadow-xl border bg-white rounded-2xl">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <Ghost className="text-slate-400" size={48} />
          <h1 className="text-2xl font-semibold text-slate-800">
            Página não encontrada
          </h1>
          <p className="text-sm text-slate-600">
            A página que você está tentando acessar não existe ou foi removida.
          </p>
        </CardHeader>

        <CardBody className="flex justify-center">
          <Button color="primary" onPress={() => router.push("/")}>
            Voltar para a página inicial
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
