import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/acesso-negado",
  "/_next",
  "/favicon.ico",
  "/404",
  "/logo.png",
];

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
