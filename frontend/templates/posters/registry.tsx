"use client";

import type { Business } from "@/lib/types";

export interface PosterProps {
  business: Business;
  content: {
    headline: string;
    tagline: string;
    details: string;
    cta: string;
  };
  aspect_ratio: "1:1" | "9:16" | "A4";
}

// Helper to resolve CSS sizing classes based on aspect ratios
export function getRatioClasses(aspect_ratio: "1:1" | "9:16" | "A4") {
  switch (aspect_ratio) {
    case "9:16":
      return "aspect-[9/16] w-[360px] h-[640px]";
    case "A4":
      return "w-[420px] h-[594px]"; // standard A4 scaling ratio
    case "1:1":
    default:
      return "aspect-square w-[450px] h-[450px]";
  }
}

// ==========================================
// GENERIC IMAGE OVERLAY POSTER ENGINE
// ==========================================
// This component renders a poster using a background image template and absolute
// coordinates to place the text fields in the correct locations on top of the image.
interface ImageOverlayPosterProps extends PosterProps {
  bgImage: string;
  headlineStyle: string; // Tailwind absolute coordinates (e.g., "absolute top-[15%] left-[5%] text-2xl font-bold")
  taglineStyle: string;  // (e.g., "absolute top-[28%] left-[5%] text-sm font-medium")
  detailsStyle: string;  // (e.g., "absolute top-[45%] left-[5%] text-xs text-gray-300")
  ctaStyle: string;      // (e.g., "absolute bottom-[10%] left-[5%] text-xs font-mono font-semibold")
}

export function ImageOverlayPoster({ 
  bgImage, 
  headlineStyle, 
  taglineStyle, 
  detailsStyle, 
  ctaStyle, 
  content, 
  aspect_ratio 
}: ImageOverlayPosterProps) {
  const sizeClasses = getRatioClasses(aspect_ratio);

  return (
    <div 
      className={`${sizeClasses} relative overflow-hidden bg-cover bg-center select-none`}
      style={{ 
        backgroundImage: `url(${bgImage})`, 
        boxSizing: "border-box" 
      }}
    >
      {/* Absolute Copy Overlays */}
      <div className={headlineStyle}>
        {content.headline}
      </div>
      <div className={taglineStyle}>
        {content.tagline}
      </div>
      <div className={detailsStyle}>
        {content.details}
      </div>
      <div className={ctaStyle}>
        {content.cta}
      </div>
    </div>
  );
}

// ==========================================
// POSTER REGISTRY (15-20 BACKGROUND IMAGES MAPPED)
// ==========================================
// Place your template background images in 'frontend/public/posters/' folder.
// E.g., 'frontend/public/posters/bistro-gold.jpg'
// Then map each one below with custom absolute styling coordinates.
export const POSTER_REGISTRY: Record<string, React.ComponentType<PosterProps>> = {
  
  // --- RESTAURANT POSTER TEMPLATES ---
  "restaurant-promo-bold": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/restaurant-bold.jpg" 
      headlineStyle="absolute top-[18%] left-[8%] right-[8%] text-3xl font-extrabold uppercase text-amber-500 font-heading text-center tracking-tight"
      taglineStyle="absolute top-[35%] left-[10%] right-[10%] text-sm font-semibold uppercase text-white font-mono text-center tracking-wider"
      detailsStyle="absolute top-[48%] left-[10%] right-[10%] text-xs text-white/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-mono uppercase bg-amber-500 text-black py-2.5 font-bold"
    />
  ),
  
  "restaurant-menu-special": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/restaurant-special.jpg" 
      headlineStyle="absolute top-[10%] left-[8%] right-[8%] text-4xl font-extrabold text-white text-center tracking-tighter"
      taglineStyle="absolute top-[22%] left-[10%] right-[10%] text-xs font-mono text-yellow-400 uppercase text-center"
      detailsStyle="absolute top-[40%] left-[8%] right-[8%] text-sm text-white/95 text-center leading-relaxed"
      ctaStyle="absolute bottom-[8%] left-[10%] right-[10%] text-center text-xs text-white font-bold tracking-widest bg-white/10 border border-white/20 py-2"
    />
  ),

  "restaurant-event-dinner": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/restaurant-dinner.jpg" 
      headlineStyle="absolute top-[25%] left-[5%] text-3xl font-bold text-white text-left font-heading"
      taglineStyle="absolute top-[38%] left-[5%] text-xs uppercase tracking-widest text-amber-500 font-semibold"
      detailsStyle="absolute top-[48%] left-[5%] right-[20%] text-xs text-white/70 leading-normal"
      ctaStyle="absolute bottom-[15%] left-[5%] text-xs font-mono text-white/90 underline"
    />
  ),

  "restaurant-hiring-chef": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/restaurant-hiring.jpg" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-4xl font-black text-[#14110F] text-center"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs font-bold text-gray-500 uppercase text-center"
      detailsStyle="absolute top-[45%] left-[15%] right-[15%] text-xs text-[#14110F]/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[10%] right-[10%] text-center text-xs font-mono uppercase bg-[#14110F] text-white py-2.5 font-bold"
    />
  ),

  // --- SALON POSTER TEMPLATES ---
  "salon-promo-pink": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/salon-pink.jpg" 
      headlineStyle="absolute top-[20%] left-[8%] right-[8%] text-3xl font-serif font-bold text-pink-600 text-center italic"
      taglineStyle="absolute top-[33%] left-[10%] right-[10%] text-xs uppercase tracking-widest text-gray-600 text-center"
      detailsStyle="absolute top-[46%] left-[10%] right-[10%] text-xs text-gray-500 text-center leading-relaxed"
      ctaStyle="absolute bottom-[14%] left-[20%] right-[20%] text-center text-xs font-mono bg-pink-600 text-white py-2 rounded-full font-semibold"
    />
  ),

  "salon-treatment-special": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/salon-special.jpg" 
      headlineStyle="absolute top-[12%] left-[10%] text-2xl font-bold text-slate-800 text-left uppercase"
      taglineStyle="absolute top-[20%] left-[10%] text-xs tracking-wider text-pink-500 font-semibold"
      detailsStyle="absolute top-[38%] left-[10%] right-[15%] text-xs text-slate-500 leading-normal"
      ctaStyle="absolute bottom-[10%] left-[10%] text-xs font-mono text-slate-900 border-b-2 border-slate-900"
    />
  ),

  "salon-grand-opening": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/salon-opening.jpg" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-3xl font-serif text-slate-900 text-center font-bold"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs tracking-[0.2em] uppercase text-pink-500 text-center"
      detailsStyle="absolute top-[45%] left-[10%] right-[10%] text-xs text-slate-500 text-center leading-relaxed"
      ctaStyle="absolute bottom-[10%] left-[15%] right-[15%] text-center text-xs font-mono uppercase bg-slate-900 text-white py-2.5"
    />
  ),

  // --- LOCAL SERVICES POSTER TEMPLATES ---
  "services-hiring-contractor": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/services-hiring.jpg" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-4xl font-black uppercase text-yellow-500 text-center tracking-tighter"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs font-mono text-white uppercase text-center"
      detailsStyle="absolute top-[45%] left-[10%] right-[10%] text-xs text-slate-300 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[10%] right-[10%] text-center text-xs font-mono uppercase bg-yellow-500 text-slate-900 py-2.5 font-bold"
    />
  ),

  "services-promo-terracotta": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/services-terracotta.jpg" 
      headlineStyle="absolute top-[18%] left-[10%] text-3xl font-bold text-slate-800 text-left"
      taglineStyle="absolute top-[28%] left-[10%] text-xs font-semibold text-orange-700 uppercase"
      detailsStyle="absolute top-[42%] left-[10%] right-[15%] text-xs text-slate-500 leading-relaxed"
      ctaStyle="absolute bottom-[15%] left-[10%] text-xs font-mono text-white bg-orange-700 py-2 px-6 inline-block font-semibold"
    />
  ),

  "services-guaranteed-trust": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/services-trust.jpg" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-3xl font-bold text-slate-900 text-center uppercase"
      taglineStyle="absolute top-[26%] left-[10%] right-[10%] text-xs text-[#9e5d3d] uppercase text-center"
      detailsStyle="absolute top-[42%] left-[10%] right-[10%] text-xs text-slate-600 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-mono border-2 border-slate-900 text-slate-900 py-2 font-bold"
    />
  )
};

// Returns the mapped layout component
export function getPosterTemplate(templateId: string): React.ComponentType<PosterProps> {
  const Component = POSTER_REGISTRY[templateId];
  if (!Component) {
    // Default fallback templates
    if (templateId.startsWith("restaurant-")) return POSTER_REGISTRY["restaurant-promo-bold"];
    if (templateId.startsWith("salon-")) return POSTER_REGISTRY["salon-promo-pink"];
    return POSTER_REGISTRY["services-hiring-contractor"];
  }
  return Component;
}
