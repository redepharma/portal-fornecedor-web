import { Head } from "./head";

import { Sidebar } from "@/components/sidebar";

/**
 * Layout padrão da aplicação, com sidebar fixa e área principal de conteúdo.
 *
 * @param {{ children: React.ReactNode }} props - Conteúdo interno exibido no layout.
 * @returns {JSX.Element} Layout com sidebar e conteúdo principal.
 */
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Head />

        <main className="flex-1 overflow-auto px-12 pt-12">{children}</main>
      </div>
    </div>
  );
}
