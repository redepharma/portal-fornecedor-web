import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";

/**
 * Custom Document para Next.js.
 * Define a estrutura HTML básica, incluindo lang, fontes e classes globais no body.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased bg-zinc-50",
          fontSans.variable,
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
