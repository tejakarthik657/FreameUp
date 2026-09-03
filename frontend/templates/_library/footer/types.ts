export interface FooterLinkGroup {
  heading: string;
  items: Array<{ label: string; href?: string }>;
}

export interface FooterVariantProps {
  brand: string;
  tagline?: string;
  copyright?: string;
  builtWith?: string;
  groups?: FooterLinkGroup[];
  socials?: Array<{ label: string; href?: string }>;
}