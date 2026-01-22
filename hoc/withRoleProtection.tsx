"use client";

import type { Role } from "@/types/auth.types";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";

/**
 * Higher-Order Component (HOC) que protege um componente baseado em roles de usuário.
 *
 * Redireciona para login se não autenticado,
 * e para página de acesso negado se o usuário não tiver permissão.
 *
 * @template P - Tipo das propriedades do componente protegido.
 * @param {React.ComponentType<P>} WrappedComponent - Componente a ser protegido.
 * @param {Role[]} allowedRoles - Lista de roles permitidos para acessar o componente.
 * @returns {React.FC<P>} Componente protegido que realiza a checagem de permissão.
 */
export function withRoleProtection<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: Role[],
) {
  return function ProtectedComponent(props: P) {
    const { user, status } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
      } else if (status === "authenticated" && user) {
        const temPermissao = user.roles.some((role) =>
          allowedRoles.includes(role),
        );

        if (!temPermissao) {
          router.push("/acesso-negado"); // você pode trocar essa rota
        }
      }
    }, [status, user, router]);

    if (status !== "authenticated") return null; // ou um loading spinner

    const temPermissao = user?.roles.some((role) =>
      allowedRoles.includes(role),
    );

    if (!temPermissao) return null;

    return <WrappedComponent {...props} />;
  };
}
