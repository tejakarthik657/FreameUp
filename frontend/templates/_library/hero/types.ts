export interface HeroVariantProps {
  headline: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  eyebrow?: string;
  theme?: {
    primary?: string;
    accent?: string;
    dark?: string;
  };
}