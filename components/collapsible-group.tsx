"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

type CollapsibleGroupProps = {
  id: string; // um id único para aria-controls
  title: string; // título do grupo
  icon?: React.ReactNode; // ícone do grupo
  items: Item[]; // itens filhos
  currentPath: string; // pathname atual (usePathname())
  className?: string;
  defaultOpen?: boolean; // opcional
};

export function CollapsibleGroup({
  id,
  title,
  icon,
  items,
  currentPath,
  className,
  defaultOpen,
}: CollapsibleGroupProps) {
  // abre se algum item for ativo OU se defaultOpen = true
  const hasActiveChild = items.some(
    (it) => currentPath === it.href || currentPath.startsWith(it.href + "/")
  );
  const [open, setOpen] = React.useState<boolean>(
    defaultOpen ?? hasActiveChild
  );

  // quando a rota mudar, mantém o grupo aberto se houver filho ativo
  React.useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  return (
    <div className={className}>
      <button
        aria-controls={id}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 transition group"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1 text-left font-medium">{title}</span>
        <ChevronDown
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""} text-slate-500 group-hover:text-slate-700`}
          size={18}
        />
      </button>

      {/* Animação de colapso: técnica de grid-rows para suavidade */}
      <div
        className={`grid transition-all duration-200 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-90"}`}
        data-open={open ? "true" : "false"}
        id={id}
      >
        <div className="overflow-hidden">
          <ul className="mt-1 pl-2 border-l border-slate-200">
            {items.map((it) => {
              const active =
                currentPath === it.href ||
                currentPath.startsWith(it.href + "/");

              return (
                <li key={it.href}>
                  <a
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition mt-1
                      ${active ? "bg-slate-200 font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-100"}`}
                    href={it.href}
                  >
                    {it.icon && <span className="shrink-0">{it.icon}</span>}
                    <span>{it.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
