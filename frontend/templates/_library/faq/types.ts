export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqVariantProps {
  heading: string;
  items: FaqItem[];
}