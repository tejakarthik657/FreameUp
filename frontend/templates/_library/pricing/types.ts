export interface PricingTier {
  name: string;
  amount: string;
  duration?: string;
  featured?: boolean;
}

export interface PricingVariantProps {
  heading: string;
  tiers: PricingTier[];
}