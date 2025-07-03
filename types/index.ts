/**
 * Propriedades para ícones SVG, estendendo propriedades padrão de SVG,
 * com um tamanho opcional para largura e altura.
 */
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
