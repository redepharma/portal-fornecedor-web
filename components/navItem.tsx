import Link from "next/link";

/**
 * Componente de item de navegação para uso em menus.
 *
 * Exibe um link com ícone e texto, destacando quando ativo.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.href - URL do link.
 * @param {React.ReactNode} props.icon - Ícone a ser exibido junto ao texto.
 * @param {React.ReactNode} props.children - Conteúdo textual do link.
 * @param {string} props.currentPath - Caminho atual da rota para determinar se está ativo.
 * @returns {JSX.Element} Elemento de link de navegação com destaque para ativo.
 */
export function NavItem({
  href,
  icon,
  children,
  currentPath,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  currentPath: string;
}) {
  const isActive = currentPath === href;

  return (
    <Link
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
        isActive ? "bg-slate-200 font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-100"
      }`}
      href={href}
    >
      {icon}
      {children}
    </Link>
  );
}
