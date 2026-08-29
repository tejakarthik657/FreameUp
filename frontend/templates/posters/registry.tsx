"use client";

import type { Business } from "@/lib/types";

export interface PosterProps {
  business: Business;
  content: {
    headline: string;
    tagline: string;
    details: string;
    cta: string;
    logo_url?: string;
    image_url?: string;
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
interface ImageOverlayPosterProps extends PosterProps {
  bgImage: string;
  headlineStyle: string; // Tailwind absolute coordinates
  taglineStyle: string;
  detailsStyle: string;
  ctaStyle: string;
  logoStyle?: string;
  imageStyle?: string;
}

export function ImageOverlayPoster({ 
  bgImage, 
  headlineStyle, 
  taglineStyle, 
  detailsStyle, 
  ctaStyle, 
  logoStyle,
  imageStyle,
  business,
  content, 
  aspect_ratio 
}: ImageOverlayPosterProps) {
  const sizeClasses = getRatioClasses(aspect_ratio);
  
  const activeLogo = content.logo_url || business.logo;
  const activeImage = content.image_url;

  return (
    <div 
      className={`${sizeClasses} relative overflow-hidden bg-cover bg-center select-none`}
      style={{ 
        backgroundImage: `url(${bgImage})`, 
        boxSizing: "border-box" 
      }}
    >
      {/* Brand Logo Overlay */}
      {activeLogo && logoStyle && (
        <div className={logoStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeLogo} alt="Logo" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Featured Image Overlay */}
      {activeImage && imageStyle && (
        <div className={imageStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeImage} alt="Uploaded promo graphic" className="w-full h-full object-cover rounded-lg border border-black/10 shadow-xs" />
        </div>
      )}

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

      {/* Translucent Brand Watermark */}
      <div className="absolute bottom-2.5 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30 border border-white/5 shadow-2xs">
        Designed by DevFrames
      </div>
    </div>
  );
}

// ==========================================
// POSTER REGISTRY (ALL TEMPLATES W/ LOGO & IMAGE COORDINATES)
// ==========================================
export const POSTER_REGISTRY: Record<string, React.ComponentType<PosterProps>> = {
  
  // --- RESTAURANT POSTER TEMPLATES ---
  "restaurant-promo-bold": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Grey%20Black%20Bold%20Restaurant%20Grand%20Opening%20Promotion%20Poster.png" 
      headlineStyle="absolute top-[18%] left-[8%] right-[8%] text-3xl font-extrabold uppercase text-amber-500 font-heading text-center tracking-tight"
      taglineStyle="absolute top-[35%] left-[10%] right-[10%] text-sm font-semibold uppercase text-white font-mono text-center tracking-wider"
      detailsStyle="absolute top-[48%] left-[10%] right-[10%] text-xs text-white/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-mono uppercase bg-amber-500 text-black py-2.5 font-bold"
      logoStyle="absolute top-[6%] left-[45%] w-8 h-8 rounded-full overflow-hidden border border-amber-500/20"
      imageStyle="absolute top-[60%] left-[35%] w-[120px] h-[70px] object-cover rounded shadow"
    />
  ),
  
  "restaurant-menu-special": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20Modern%20Cafe%20Happy%20Hour%20Poster.png" 
      headlineStyle="absolute top-[10%] left-[8%] right-[8%] text-4xl font-extrabold text-white text-center tracking-tighter"
      taglineStyle="absolute top-[22%] left-[10%] right-[10%] text-xs font-mono text-yellow-400 uppercase text-center"
      detailsStyle="absolute top-[40%] left-[8%] right-[8%] text-sm text-white/95 text-center leading-relaxed"
      ctaStyle="absolute bottom-[8%] left-[10%] right-[10%] text-center text-xs text-white font-bold tracking-widest bg-white/10 border border-white/20 py-2"
      logoStyle="absolute top-[4%] left-[4%] w-8 h-8 rounded-full overflow-hidden border border-white/20"
      imageStyle="absolute top-[52%] left-[30%] w-[160px] h-[90px] object-cover rounded shadow border border-white/10"
    />
  ),

  "restaurant-event-dinner": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Gemini_Generated_Image_4xc46i4xc46i4xc4.png" 
      headlineStyle="absolute top-[25%] left-[5%] text-3xl font-bold text-white text-left font-heading"
      taglineStyle="absolute top-[38%] left-[5%] text-xs uppercase tracking-widest text-amber-500 font-semibold"
      detailsStyle="absolute top-[48%] left-[5%] right-[20%] text-xs text-white/70 leading-normal"
      ctaStyle="absolute bottom-[15%] left-[5%] text-xs font-mono text-white/90 underline"
      logoStyle="absolute top-[5%] right-[5%] w-8 h-8 rounded-full overflow-hidden border border-white/10"
      imageStyle="absolute top-[48%] right-[5%] w-[90px] h-[90px] object-cover rounded-lg border border-white/15"
    />
  ),

  "restaurant-hiring-chef": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Blue%20And%20Black%20Modern%20We%20Are%20Hiring%20Poster%20.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-4xl font-black text-[#14110F] text-center"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs font-bold text-gray-500 uppercase text-center"
      detailsStyle="absolute top-[45%] left-[15%] right-[15%] text-xs text-[#14110F]/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[10%] right-[10%] text-center text-xs font-mono uppercase bg-[#14110F] text-white py-2.5 font-bold"
      logoStyle="absolute top-[4%] left-[4%] w-8 h-8 rounded-full overflow-hidden border border-gray-300"
      imageStyle="absolute top-[58%] left-[30%] w-[160px] h-[100px] object-cover rounded shadow"
    />
  ),

  "restaurant-discount-percent": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20Modern%20Cafe%20Happy%20Hour%20Poster.png" 
      headlineStyle="absolute top-[18%] left-[8%] right-[8%] text-3xl font-extrabold uppercase text-amber-500 font-heading text-center tracking-tight"
      taglineStyle="absolute top-[35%] left-[10%] right-[10%] text-sm font-semibold uppercase text-white font-mono text-center tracking-wider"
      detailsStyle="absolute top-[48%] left-[10%] right-[10%] text-xs text-white/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-mono uppercase bg-amber-500 text-black py-2.5 font-bold"
      logoStyle="absolute top-[6%] left-[45%] w-8 h-8 rounded-full overflow-hidden border border-amber-500/20"
      imageStyle="absolute top-[60%] left-[35%] w-[120px] h-[70px] object-cover rounded shadow"
    />
  ),

  "restaurant-grand-opening": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Grey%20Black%20Bold%20Restaurant%20Grand%20Opening%20Promotion%20Poster.png" 
      headlineStyle="absolute top-[18%] left-[8%] right-[8%] text-3xl font-extrabold uppercase text-amber-500 font-heading text-center tracking-tight"
      taglineStyle="absolute top-[35%] left-[10%] right-[10%] text-sm font-semibold uppercase text-white font-mono text-center tracking-wider"
      detailsStyle="absolute top-[48%] left-[10%] right-[10%] text-xs text-white/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-mono uppercase bg-amber-500 text-black py-2.5 font-bold"
      logoStyle="absolute top-[6%] left-[45%] w-8 h-8 rounded-full overflow-hidden border border-amber-500/20"
      imageStyle="absolute top-[60%] left-[35%] w-[120px] h-[70px] object-cover rounded shadow"
    />
  ),

  // --- SALON POSTER TEMPLATES ---
  "salon-promo-pink": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Brown%20Modern%20Beauty%20Spa%20%26%20Salon%20Poster.png" 
      headlineStyle="absolute top-[20%] left-[8%] right-[8%] text-3xl font-serif font-bold text-pink-600 text-center italic"
      taglineStyle="absolute top-[33%] left-[10%] right-[10%] text-xs uppercase tracking-widest text-gray-600 text-center"
      detailsStyle="absolute top-[46%] left-[10%] right-[10%] text-xs text-gray-500 text-center leading-relaxed"
      ctaStyle="absolute bottom-[14%] left-[20%] right-[20%] text-center text-xs font-mono bg-pink-600 text-white py-2 rounded-full font-semibold"
      logoStyle="absolute top-[5%] left-[45%] w-8 h-8 rounded-full overflow-hidden border border-pink-500/20"
      imageStyle="absolute top-[55%] left-[25%] w-[200px] h-[120px] object-cover rounded-lg shadow-sm border border-pink-500/20"
    />
  ),

  "salon-treatment-special": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Brown%20Modern%20Beauty%20Spa%20%26%20Salon%20Poster.png" 
      headlineStyle="absolute top-[12%] left-[10%] text-2xl font-bold text-slate-800 text-left uppercase"
      taglineStyle="absolute top-[20%] left-[10%] text-xs tracking-wider text-pink-500 font-semibold"
      detailsStyle="absolute top-[38%] left-[10%] right-[15%] text-xs text-slate-500 leading-normal"
      ctaStyle="absolute bottom-[10%] left-[10%] text-xs font-mono text-slate-900 border-b-2 border-slate-900"
      logoStyle="absolute top-[5%] right-[5%] w-8 h-8 rounded-full overflow-hidden border border-slate-200"
      imageStyle="absolute top-[55%] right-[5%] w-[120px] h-[120px] object-cover rounded-lg border border-slate-200 shadow"
    />
  ),

  "salon-grand-opening": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20Gold%20and%20White%20Elegant%20Grand%20Reopening%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-3xl font-serif text-slate-900 text-center font-bold"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs tracking-[0.2em] uppercase text-pink-500 text-center"
      detailsStyle="absolute top-[45%] left-[10%] right-[10%] text-xs text-slate-500 text-center leading-relaxed"
      ctaStyle="absolute bottom-[10%] left-[15%] right-[15%] text-center text-xs font-mono uppercase bg-slate-900 text-white py-2.5"
      logoStyle="absolute top-[5%] left-[45%] w-8 h-8 rounded-full overflow-hidden border border-gray-300"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded-lg shadow-xs"
    />
  ),

  "salon-hiring-stylist": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Pink%20Organic%20Makeup%20Artist%20Assistant%20Wanted%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-3xl font-bold text-slate-800 text-center"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs text-pink-600 uppercase text-center"
      detailsStyle="absolute top-[45%] left-[15%] right-[15%] text-xs text-slate-500 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[10%] right-[10%] text-center text-xs font-mono bg-slate-900 text-white py-2"
      logoStyle="absolute top-[4%] left-[4%] w-8 h-8 rounded-full overflow-hidden border"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "salon-discount-percent": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Red%20and%20Yellow%20Modern%20Flash%20Sale%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-4xl font-black text-red-600 text-center uppercase"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs text-slate-900 uppercase text-center font-mono"
      detailsStyle="absolute top-[45%] left-[15%] right-[15%] text-xs text-slate-800 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[10%] right-[10%] text-center text-xs font-mono bg-red-600 text-white py-2 font-bold"
      logoStyle="absolute top-[4%] left-[4%] w-8 h-8 rounded-full overflow-hidden border border-red-500/20"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "salon-holiday-special": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20Gold%20and%20White%20Elegant%20Grand%20Reopening%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-3xl font-serif text-slate-900 text-center font-bold"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs tracking-[0.2em] uppercase text-pink-500 text-center"
      detailsStyle="absolute top-[45%] left-[10%] right-[10%] text-xs text-slate-500 text-center leading-relaxed"
      ctaStyle="absolute bottom-[10%] left-[15%] right-[15%] text-center text-xs font-mono uppercase bg-slate-900 text-white py-2.5"
      logoStyle="absolute top-[5%] left-[45%] w-8 h-8 rounded-full overflow-hidden border border-gray-300"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded-lg shadow-xs"
    />
  ),

  // --- LOCAL SERVICES POSTER TEMPLATES ---
  "services-hiring-contractor": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20and%20White%20Illustration%20Join%20Our%20Team%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-4xl font-black uppercase text-yellow-500 text-center tracking-tighter"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs font-mono text-white uppercase text-center"
      detailsStyle="absolute top-[45%] left-[10%] right-[10%] text-xs text-slate-300 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[10%] right-[10%] text-center text-xs font-mono uppercase bg-yellow-500 text-slate-900 py-2.5 font-bold"
      logoStyle="absolute top-[4%] left-[4%] w-8 h-8 rounded-full overflow-hidden border border-yellow-500/20"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-promo-terracotta": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Black%20Blue%20and%20White%20Modern%20Handyman%20Service%20Poster.png" 
      headlineStyle="absolute top-[18%] left-[10%] text-3xl font-bold text-slate-800 text-left"
      taglineStyle="absolute top-[28%] left-[10%] text-xs font-semibold text-orange-700 uppercase"
      detailsStyle="absolute top-[42%] left-[10%] right-[15%] text-xs text-slate-500 leading-relaxed"
      ctaStyle="absolute bottom-[15%] left-[10%] text-xs font-mono text-white bg-orange-700 py-2 px-6 inline-block font-semibold"
      logoStyle="absolute top-[4%] right-[4%] w-8 h-8 rounded-full overflow-hidden border border-orange-700/20"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-guaranteed-trust": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Blue%20White%20Minimalist%20Health%20Care%20Service%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-3xl font-bold text-slate-900 text-center uppercase"
      taglineStyle="absolute top-[26%] left-[10%] right-[10%] text-xs text-[#9e5d3d] uppercase text-center"
      detailsStyle="absolute top-[42%] left-[10%] right-[10%] text-xs text-slate-600 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-mono border-2 border-slate-900 text-slate-900 py-2 font-bold"
      logoStyle="absolute top-[4%] left-[4%] w-8 h-8 rounded-full overflow-hidden border"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-event-workspace": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Purple%20Bold%20Simple%20Painting%20Workshop%20Event%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-3xl font-bold text-white text-center"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs tracking-wider text-purple-200 uppercase text-center"
      detailsStyle="absolute top-[45%] left-[15%] right-[15%] text-xs text-white/80 text-center leading-normal"
      ctaStyle="absolute bottom-[12%] left-[10%] right-[10%] text-center text-xs font-mono bg-white text-purple-900 py-2 font-bold"
      logoStyle="absolute top-[4%] left-[4%] w-8 h-8 rounded-full overflow-hidden border border-purple-200/20"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-discount-percent": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Creative%20Blue%20Fashion%20Special%20Offer%20(Poster).png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-4xl font-extrabold text-blue-600 text-center"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs text-slate-500 uppercase text-center"
      detailsStyle="absolute top-[45%] left-[15%] right-[15%] text-xs text-slate-600 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[10%] right-[10%] text-center text-xs font-mono bg-blue-600 text-white py-2"
      logoStyle="absolute top-[4%] left-[4%] w-8 h-8 rounded-full overflow-hidden border"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-emergency-247": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Brown%20and%20Grey%20Modern%20Testimonial%20Reviews%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-3xl font-bold text-slate-900 text-center"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs text-gray-500 uppercase text-center"
      detailsStyle="absolute top-[45%] left-[15%] right-[15%] text-xs text-slate-600 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[10%] right-[10%] text-center text-xs font-mono bg-slate-900 text-white py-2"
      logoStyle="absolute top-[4%] left-[4%] w-8 h-8 rounded-full overflow-hidden border"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  )
};

// Returns the mapped layout component
export function getPosterTemplate(templateId: string): React.ComponentType<PosterProps> {
  const Component = POSTER_REGISTRY[templateId];
  if (!Component) {
    if (templateId.startsWith("restaurant-")) return POSTER_REGISTRY["restaurant-promo-bold"];
    if (templateId.startsWith("salon-")) return POSTER_REGISTRY["salon-promo-pink"];
    return POSTER_REGISTRY["services-hiring-contractor"];
  }
  return Component;
}
