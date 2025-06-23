"use client";

import { AlertCircle } from "lucide-react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useRouter } from "next/router";

export default function AcessoNegadoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full shadow-xl border border-red-200 bg-white rounded-2xl">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <AlertCircle className="text-red-500" size={48} />
          <h1 className="text-2xl font-semibold text-red-600">Acesso negado</h1>
          <p className="text-sm text-slate-600">
            Você não tem permissão para acessar esta página.
          </p>
        </CardHeader>

        <CardBody className="flex justify-center">
          <Button color="primary" onPress={() => router.push("/")}>
            Voltar para o início
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
