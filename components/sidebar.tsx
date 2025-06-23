"use client";

import Link from "next/link";
import { Home, Users, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-full shadow-sm p-4 space-y-2">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Menu</h2>

      <NavItem href="/" icon={<Home size={18} />}>
        Início
      </NavItem>
      <NavItem href="fornecedor/vendas" icon={<Users size={18} />}>
        Vendas
      </NavItem>
      <NavItem href="fornecedor/estoque" icon={<Settings size={18} />}>
        Estoque
      </NavItem>
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
