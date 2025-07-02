import { env } from "process";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname.startsWith("10.7.0.116")) {
      return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    }

    if (hostname === "fornecedor.nelfarma.dev.br") {
      return (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://apifornecedor.nelfarma.dev.br"
      );
    }
  }

  return "http://localhost:3001";
}
