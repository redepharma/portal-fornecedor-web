import { Head } from "./head";

import { Sidebar } from "@/components/sidebar";

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
