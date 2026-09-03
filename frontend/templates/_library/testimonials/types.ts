export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface TestimonialsVariantProps {
  heading?: string;
  items: Testimonial[];
}