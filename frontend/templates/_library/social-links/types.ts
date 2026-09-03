export interface SocialLink {
  label: string;
  href?: string;
}

export interface SocialLinksVariantProps {
  heading?: string;
  links: SocialLink[];
}