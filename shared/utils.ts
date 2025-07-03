/**
 * Retorna a URL base da API conforme o ambiente e hostname.
 * @returns A URL base para chamadas à API.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname.startsWith("10.7.0.116")) {
      return process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.7.0.116:3000";
    }

    if (hostname === "fornecedor.nelfarma.dev.br") {
      return (
        process.env.NEXT_PUBLIC_API_BASE_URL_EXTERNA ||
        "https://apifornecedor.nelfarma.dev.br"
      );
    }
  }

  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  return process.env.NODE_ENV === "production"
    ? "http://10.7.0.116:3000"
    : "http://localhost:3000";
}
