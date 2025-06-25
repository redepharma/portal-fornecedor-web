import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { I18nProvider } from "@react-aria/i18n";
import { ToastProvider } from "@heroui/react";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/auth.context";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider defaultTheme="light">
        <AuthProvider>
          <I18nProvider locale="pt-BR">
            <ToastProvider />
            <Component {...pageProps} />
          </I18nProvider>
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
