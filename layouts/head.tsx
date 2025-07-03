import React from "react";
import NextHead from "next/head";

import { siteConfig } from "@/config/site";

/**
 * Componente para definir tags <head> da página, como título e meta tags.
 *
 * Utiliza dados da configuração do site para título, descrição e favicon.
 *
 * @returns {JSX.Element} Elemento Next.js Head configurado para SEO e responsividade.
 */
export const Head = () => {
  return (
    <NextHead>
      <title>{siteConfig.name}</title>
      <meta key="title" content={siteConfig.name} property="og:title" />
      <meta content={siteConfig.description} property="og:description" />
      <meta content={siteConfig.description} name="description" />
      <meta
        key="viewport"
        content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        name="viewport"
      />
      <link href="/favicon.ico" rel="icon" />
    </NextHead>
  );
};
