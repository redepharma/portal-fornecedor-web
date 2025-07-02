"use client";

import { Home, LogOut, Package, BadgeDollarSign } from "lucide-react";
import { usePathname } from "next/navigation";
import { Divider } from "@heroui/react";

import { NavItem } from "./navItem";

import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/services/auth.service";
import { Role } from "@/types/auth.types";

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
        <NavItem currentPath={pathname} href="/" icon={<Home size={18} />}>
          Início
        </NavItem>
        <NavItem
          currentPath={pathname}
          href="/fornecedor/vendas"
          icon={<BadgeDollarSign size={18} />}
        >
          Vendas
        </NavItem>
        <NavItem
          currentPath={pathname}
          href="/fornecedor/estoque"
          icon={<Package size={18} />}
        >
          Estoque
        </NavItem>
        {user?.roles?.includes("admin") && (
          <NavItem
            currentPath={pathname}
            href="/fornecedor/usuarios"
            icon={<Package size={18} />}
          >
            Usuários
          </NavItem>
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
