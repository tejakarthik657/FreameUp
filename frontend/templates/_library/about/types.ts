export interface AboutVariantProps {
  title: string;
  description: string;
  imageUrl?: string;
  stats?: Array<{ value: string; label: string }>;
}