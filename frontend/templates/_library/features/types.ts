export interface FeatureItem {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface FeaturesVariantProps {
  heading: string;
  features: FeatureItem[];
}