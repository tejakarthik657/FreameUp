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
// POSTER TEMPLATE 1: Restaurant Bold Bistro
// ==========================================
export function RestaurantPromoBold({ business, content, aspect_ratio }: PosterProps) {
  const sizeClasses = getRatioClasses(aspect_ratio);
  
  return (
    <div 
      className={`${sizeClasses} bg-[#14110F] text-white p-8 flex flex-col justify-between items-center text-center relative overflow-hidden font-sans border-8 border-[#C9A84C]`}
      style={{ boxSizing: "border-box" }}
    >
      {/* Decorative Warm Radial Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Section */}
      <div className="z-10 w-full">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A84C] uppercase block mb-1">
          {business.name}
        </span>
        <div className="h-[1px] bg-white/10 w-12 mx-auto" />
      </div>

      {/* Body Content */}
      <div className="z-10 space-y-4 max-w-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase font-heading leading-tight tracking-tight text-white select-none">
          {content.headline}
        </h1>
        <p className="text-sm font-semibold tracking-wider text-[#C9A84C] uppercase font-mono">
          {content.tagline}
        </p>
        <p className="text-xs text-white/75 font-light leading-relaxed px-4">
          {content.details}
        </p>
      </div>

      {/* Footer / CTA Section */}
      <div className="z-10 w-full space-y-4">
        {/* Dynamic Reservation / Order indicators */}
        <div className="flex gap-2 justify-center flex-wrap">
          {business.phone && (
            <span className="text-[9px] bg-white/10 px-2.5 py-1 rounded-full border border-white/20 font-mono">
              📞 {business.phone}
            </span>
          )}
          {business.address && (
            <span className="text-[9px] bg-white/10 px-2.5 py-1 rounded-full border border-white/20 font-mono">
              📍 {business.address.split(",")[0]}
            </span>
          )}
        </div>
        
        {/* Prominent Action Button Box */}
        <div className="bg-[#C9A84C] text-[#14110F] text-xs font-mono font-bold uppercase tracking-wider py-2.5 px-6 inline-block w-full">
          {content.cta}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// POSTER TEMPLATE 2: Salon Elegant Pink Aurora
// ==========================================
export function SalonPromoPink({ business, content, aspect_ratio }: PosterProps) {
  const sizeClasses = getRatioClasses(aspect_ratio);

  return (
    <div 
      className={`${sizeClasses} bg-[#FAF5F6] text-slate-800 p-8 flex flex-col justify-between items-center text-center relative overflow-hidden font-sans border-4 border-[#F472B6]/20`}
      style={{ boxSizing: "border-box" }}
    >
      {/* Decorative Soft Rose Glows */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#F472B6]/10 blur-2xl" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#EC4899]/10 blur-2xl" />

      {/* Header */}
      <div className="z-10 w-full">
        <h4 className="text-xs font-bold tracking-[0.2em] text-[#EC4899] uppercase">
          {business.name}
        </h4>
        <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase block mt-1">
          Special Treatment Highlight
        </span>
      </div>

      {/* Content */}
      <div className="z-10 space-y-3 max-w-sm">
        <h2 className="text-3xl font-bold font-serif text-slate-900 tracking-tight leading-none italic uppercase">
          {content.headline}
        </h2>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#F472B6] to-transparent w-20 mx-auto" />
        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest leading-relaxed">
          {content.tagline}
        </p>
        <p className="text-xs text-gray-400 italic font-light px-4 leading-normal">
          {content.details}
        </p>
      </div>

      {/* CTA Footer */}
      <div className="z-10 w-full space-y-3">
        <p className="text-[10px] text-gray-400 font-mono tracking-wider">
          {content.cta}
        </p>
        <div className="bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-widest py-2.5 px-6 rounded-full hover:bg-slate-800 transition-colors">
          Book Appointment
        </div>
      </div>
    </div>
  );
}

// ==========================================
// POSTER TEMPLATE 3: Services Bold Contractor
// ==========================================
export function ServicesHiringContractor({ business, content, aspect_ratio }: PosterProps) {
  const sizeClasses = getRatioClasses(aspect_ratio);

  return (
    <div 
      className={`${sizeClasses} bg-[#1E293B] text-white p-8 flex flex-col justify-between items-start text-left relative overflow-hidden font-sans border-t-8 border-yellow-500`}
      style={{ boxSizing: "border-box" }}
    >
      {/* Decorative Grid Line Graphics */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Header */}
      <div className="z-10 w-full flex justify-between items-center border-b border-white/10 pb-4">
        <span className="font-bold text-xs uppercase tracking-wider text-yellow-500">{business.name}</span>
        <span className="text-[8px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded font-mono border border-yellow-500/20">WARRANTY INFO</span>
      </div>

      {/* Main Content */}
      <div className="z-10 space-y-4 max-w-sm">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
          {content.headline}
        </h2>
        <div className="w-12 h-1 bg-yellow-500" />
        <p className="text-sm font-semibold tracking-wide text-yellow-400 font-mono">
          {content.tagline}
        </p>
        <p className="text-xs text-slate-300 font-light leading-relaxed">
          {content.details}
        </p>
      </div>

      {/* Footer */}
      <div className="z-10 w-full space-y-4">
        <div className="bg-yellow-500 text-slate-900 font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 block w-full text-center">
          {content.cta}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// REGISTRY: MAP OF 15-20 POSTER TEMPLATES
// ==========================================
// This registry maps Groq template_id strings directly to layout render components.
// To add more poster templates (up to 15-20), drop the React components above and
// register their names in this index map.
export const POSTER_REGISTRY: Record<string, React.ComponentType<PosterProps>> = {
  // Restaurant Templates
  "restaurant-promo-bold": RestaurantPromoBold,
  "restaurant-menu-special": RestaurantPromoBold, // mapping variants to base components for illustration
  "restaurant-event-dinner": RestaurantPromoBold,
  "restaurant-hiring-chef": RestaurantPromoBold,
  "restaurant-discount-percent": RestaurantPromoBold,
  "restaurant-grand-opening": RestaurantPromoBold,

  // Salon Templates
  "salon-promo-pink": SalonPromoPink,
  "salon-treatment-special": SalonPromoPink,
  "salon-grand-opening": SalonPromoPink,
  "salon-hiring-stylist": SalonPromoPink,
  "salon-discount-percent": SalonPromoPink,
  "salon-holiday-special": SalonPromoPink,

  // Local Services / Contractor Templates
  "services-hiring-contractor": ServicesHiringContractor,
  "services-promo-terracotta": ServicesHiringContractor,
  "services-discount-percent": ServicesHiringContractor,
  "services-guaranteed-trust": ServicesHiringContractor,
  "services-event-workspace": ServicesHiringContractor,
  "services-emergency-247": ServicesHiringContractor
};

export function getPosterTemplate(templateId: string): React.ComponentType<PosterProps> {
  const Component = POSTER_REGISTRY[templateId];
  if (!Component) {
    // Default fallback based on segment prefix in case of mismatch
    if (templateId.startsWith("restaurant-")) return RestaurantPromoBold;
    if (templateId.startsWith("salon-")) return SalonPromoPink;
    return ServicesHiringContractor;
  }
  return Component;
}
