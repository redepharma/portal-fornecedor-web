"use client";

import { Home, LogOut, Package, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { Divider } from "@heroui/react";

import { NavItem } from "./navItem";
import { CollapsibleGroup } from "./collapsible-group"; // <— importe aqui

import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/services/auth.service";

export function Sidebar() {
  const { user, setUser } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-zinc-100 border-r h-full shadow-sm p-4 flex flex-col justify-between">
      <div>
        <img alt="Logo" className="w-44 mx-auto mb-1" src="/logo.png" />
        <Divider className="my-4" />
        <p className="font-bold text-slate-700 text-center">{user?.nome}</p>
        <Divider className="my-4" />

        {/* Link "solto" */}
        <NavItem currentPath={pathname} href="/" icon={<Home size={18} />}>
          Início
        </NavItem>

        {/* Grupo Compras */}
        {/* <CollapsibleGroup
          currentPath={pathname}
          icon={<PackagePlus size={18} />}
          id="grp-compras"
          items={[
            {
              href: "/compras/pedidos",
              label: "Enviar pedidos",
            },
            {
              href: "/compras/status-pedidos",
              label: "Status Pedido",
            },
          ]}
          title="Compras"
        /> */}

        {/* Grupo Fornecedor */}
        <CollapsibleGroup
          currentPath={pathname}
          icon={<Package size={18} />}
          id="fornecedor"
          items={[
            {
              href: "/fornecedor/vendas",
              label: "Vendas",
            },
            {
              href: "/fornecedor/estoque",
              label: "Estoque",
            },
          ]}
          title="Fornecedor"
        />

        {/* Grupo Administração (apenas admins) */}
        {user?.roles?.includes("admin") && (
          <CollapsibleGroup
            currentPath={pathname}
            icon={<Users size={18} />}
            id="grp-admin"
            items={[
              {
                href: "/gerenciar/usuarios",
                label: "Usuários",
              },
            ]}
            title="Administração"
          />
        )}
      </div>

      <button
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-100 transition"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
