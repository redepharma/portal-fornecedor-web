"use client";

import Link from "next/link";
import { Home, Users, Settings, LogOut } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/services/auth.service";

export function Sidebar() {
  const { setUser } = useAuth();

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-white border-r h-full shadow-sm p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Menu</h2>

        <NavItem href="/" icon={<Home size={18} />}>
          Início
        </NavItem>
        <NavItem href="/fornecedor/vendas" icon={<Users size={18} />}>
          Vendas
        </NavItem>
        <NavItem href="/fornecedor/estoque" icon={<Settings size={18} />}>
          Estoque
        </NavItem>
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

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 transition"
      href={href}
    >
      {icon}
      {children}
    </Link>
  );
}
