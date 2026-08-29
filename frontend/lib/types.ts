// Mirrors backend/app/schemas/business.py exactly — the shared data contract.

export type Category = "restaurant" | "salon" | "local_services";

export interface MenuItem {
  name: string;
  price?: string;
  description?: string;
  category?: string;
  is_veg?: boolean;
}

export interface ServiceItem {
  name: string;
  price?: string;
  description?: string;
  duration?: string;
}

export interface Hours {
  day: string;
  open?: string;
  close?: string;
  closed: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface Business {
  id?: string;
  category: Category;
  name: string;
  tagline?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  maps?: string;
  mapsUrl?: string;
  instagram?: string;
  facebook?: string;
  threads?: string;
  bookingUrl?: string;
  orderUrl?: string;
  hours: Hours[];
  images: string[];
  logo?: string;
  services: ServiceItem[];
  menu: MenuItem[];
  team: TeamMember[];
  testimonials: Testimonial[];
  featured_images: string[];   // up to 3 — hero background / about image / contact highlight

  // Advanced metadata fields
  business_type?: string;
  cuisine_type?: string;
  salon_type?: string;
  service_type?: string;
  years_in_business?: string;
  emergency_service?: boolean;
  response_time?: string;
  walk_in_accepted?: boolean;
  certifications?: string;
  service_area?: string;

  price_range?: string;
  dietary_options?: string;
  reservation_policy?: string;
  parking_info?: string;
  dress_code?: string;
  ambience?: string;
  brands_used?: string;
  amenities?: string;
  accessibility?: string;
  cancellation_policy?: string;
  specialties?: string;
  licensing_info?: string;
  warranty_info?: string;
  pricing_model?: string;
  menu_image_url?: string;
}

export interface Palette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  font: string;
}

export interface FontPairing {
  id: string;
  name: string;
  heading_font: string;
  body_font: string;
}

export interface StockImage {
  id: string;
  category: Category;
  url: string;
  alt: string;
}

export interface BusinessOut extends Business {
  id: string;
  user_id: string;
}

export interface GeneratedContent {
  hero: { headline: string; description: string; cta: string };
  about: { title: string; description: string };
  theme: { primary: string; secondary: string; font: string };
  section_order: string[];
}

export interface WebsiteOut {
  id: string;
  business_id: string;
  template: string;
  generated_content: GeneratedContent;
  slug: string;
  published_url: string;
  qr_url: string;
  is_static: boolean;
  static_generated_at?: string;
}

// Style cards shown to the owner — internal template ids are never surfaced as labels (section 4).
export interface StyleOption {
  templateId: string;   // e.g. "restaurant-premium" — internal only, never shown
  imageUrl: string;
  displayLabel: string; // e.g. "Elegant" — what the owner actually sees
}

export interface SiteDataResponse {
  site_id: string;
  slug: string;
  published_url: string;
  qr_url: string;
  business: Business;
  manifest: RenderManifest;
}

export interface RenderManifest {
  template_id: string;
  theme: {
    primary: string;
    secondary: string;
    accent?: string;
    font: string;
    heading_font?: string;
    body_font?: string;
  };
  section_order: string[];
  sections: Record<string, {
    type: string;
    density?: string;
    data: Record<string, unknown>;
  }>;
  components_used: string[];
}

export interface LeadResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  business_id: string;
  created_at: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  is_verified: boolean;
  settings: {
    model: string;
    base_domain: string;
    static_deploy: string;
    enable_ai: boolean;
  };
}

export interface PosterResponse {
  id: string;
  business_id: string;
  template_id: string;
  goal: string;
  content: {
    headline: string;
    tagline: string;
    details: string;
    cta: string;
    logo_url?: string;
    image_url?: string;
  };
  aspect_ratio: "1:1" | "9:16" | "A4";
  created_at: string;
}
