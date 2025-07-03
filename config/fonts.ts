import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

/**
 * Fonte sans-serif Inter importada do Google Fonts,
 * configurada para uso com variável CSS --font-sans.
 */
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

/**
 * Fonte monoespaçada Fira Code importada do Google Fonts,
 * configurada para uso com variável CSS --font-mono.
 */
export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
