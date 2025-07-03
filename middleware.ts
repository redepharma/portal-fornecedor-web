import { NextRequest, NextResponse } from "next/server";

/**
 * Lista de rotas públicas que não requerem autenticação.
 */
const PUBLIC_PATHS = [
  "/login",
  "/acesso-negado",
  "/_next",
  "/favicon.ico",
  "/404",
  "/logo.png",
];

/**
 * Middleware para controle de acesso baseado em token JWT armazenado em cookie.
 * - Redireciona usuários logados que acessam a página de login para a home.
 * - Permite acesso a rotas públicas mesmo sem token.
 * - Bloqueia acesso a rotas privadas sem token, redirecionando para login.
 *
 * @param {NextRequest} req - Requisição Next.js
 * @returns {NextResponse} - Resposta com redirecionamento ou continuação normal
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  // ✅ Redireciona usuários logados que tentarem acessar /login
  if (pathname === "/login" && token) {
    const url = req.nextUrl.clone();

    url.pathname = "/";

    return NextResponse.redirect(url);
  }

  // ✅ Permitir acesso a rotas públicas (sem token)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ❌ Bloqueia acesso privado sem token
  if (!token) {
    const url = req.nextUrl.clone();

    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
