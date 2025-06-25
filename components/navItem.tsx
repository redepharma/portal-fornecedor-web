import Link from "next/link";

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
        isActive
          ? "bg-slate-200 font-semibold text-slate-900"
          : "text-slate-700 hover:bg-slate-100"
      }`}
      href={href}
    >
      {icon}
      {children}
    </Link>
  );
}
