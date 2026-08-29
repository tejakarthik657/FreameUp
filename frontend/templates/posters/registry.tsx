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
      className={`${sizeClasses} relative overflow-hidden bg-cover bg-center select-none font-sans antialiased`}
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
          <img src={activeImage} alt="Uploaded promo graphic" className="w-full h-full object-cover rounded-lg border border-black/10 shadow-xs animate-fade-in" />
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
// POSTER REGISTRY (ALL TEMPLATES W/ PREMIUM TYPOGRAPHY)
// ==========================================
export const POSTER_REGISTRY: Record<string, React.ComponentType<PosterProps>> = {
  
  // --- RESTAURANT POSTER TEMPLATES ---
  "restaurant-promo-bold": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Grey%20Black%20Bold%20Restaurant%20Grand%20Opening%20Promotion%20Poster.png" 
      headlineStyle="absolute top-[18%] left-[8%] right-[8%] text-3xl sm:text-4xl font-poppins font-black uppercase text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center tracking-tight leading-none"
      taglineStyle="absolute top-[35%] left-[10%] right-[10%] text-xs sm:text-sm font-poppins font-bold uppercase text-white tracking-widest text-center"
      detailsStyle="absolute top-[48%] left-[10%] right-[10%] text-xs font-sans font-semibold text-white/90 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-poppins font-black uppercase bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-3 px-6 rounded-md shadow-lg transition-all"
      logoStyle="absolute top-[6%] left-[45%] w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400/40 shadow-md bg-white/10 backdrop-blur-xs"
      imageStyle="absolute top-[60%] left-[32%] w-[130px] h-[80px] object-cover rounded-lg border border-white/10 shadow-lg"
    />
  ),
  
  "restaurant-menu-special": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20Modern%20Cafe%20Happy%20Hour%20Poster.png" 
      headlineStyle="absolute top-[10%] left-[8%] right-[8%] text-3xl sm:text-4xl font-fraunces font-black text-emerald-50 drop-shadow-md text-center leading-tight tracking-tight"
      taglineStyle="absolute top-[22%] left-[10%] right-[10%] text-[10px] sm:text-xs font-sans font-bold text-yellow-300 uppercase tracking-[0.25em] text-center"
      detailsStyle="absolute top-[40%] left-[8%] right-[8%] text-xs font-serif italic text-white/95 text-center leading-relaxed px-6"
      ctaStyle="absolute bottom-[8%] left-[15%] right-[15%] text-center text-xs font-poppins font-bold text-white tracking-widest uppercase bg-transparent border-2 border-white/30 hover:border-white px-5 py-2.5 rounded transition-all"
      logoStyle="absolute top-[4%] left-[4%] w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-emerald-950/20 shadow"
      imageStyle="absolute top-[52%] left-[30%] w-[160px] h-[90px] object-cover rounded-lg shadow-lg border border-white/10"
    />
  ),

  "restaurant-event-dinner": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Gemini_Generated_Image_4xc46i4xc46i4xc4.png" 
      headlineStyle="absolute top-[25%] left-[5%] text-2xl sm:text-3xl font-fraunces font-black text-amber-500 drop-shadow-md text-left leading-tight"
      taglineStyle="absolute top-[38%] left-[5%] text-[10px] font-sans font-bold uppercase tracking-widest text-white/90"
      detailsStyle="absolute top-[48%] left-[5%] right-[20%] text-xs text-white/80 leading-relaxed font-sans"
      ctaStyle="absolute bottom-[15%] left-[5%] text-[10px] font-mono font-bold uppercase tracking-wider text-slate-950 bg-amber-500 py-1.5 px-4 rounded shadow hover:bg-amber-400 transition-all"
      logoStyle="absolute top-[5%] right-[5%] w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-black/10 backdrop-blur-xs"
      imageStyle="absolute top-[48%] right-[5%] w-[100px] h-[100px] object-cover rounded-lg border border-white/20 shadow-md"
    />
  ),

  "restaurant-hiring-chef": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Blue%20And%20Black%20Modern%20We%20Are%20Hiring%20Poster%20.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-3xl sm:text-4xl font-poppins font-black uppercase tracking-tight text-white drop-shadow-lg text-center"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs font-poppins font-bold text-cyan-400 uppercase tracking-[0.2em] text-center"
      detailsStyle="absolute top-[45%] left-[12%] right-[12%] text-xs font-sans font-medium text-slate-200/90 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-poppins font-black uppercase bg-cyan-400 hover:bg-cyan-300 text-slate-950 py-3 rounded-md shadow-lg transition-all"
      logoStyle="absolute top-[4%] left-[4%] w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-slate-900/30"
      imageStyle="absolute top-[58%] left-[30%] w-[160px] h-[95px] object-cover rounded-lg border border-white/10 shadow"
    />
  ),

  "restaurant-discount-percent": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20Modern%20Cafe%20Happy%20Hour%20Poster.png" 
      headlineStyle="absolute top-[10%] left-[8%] right-[8%] text-3xl sm:text-4xl font-fraunces font-black text-emerald-50 drop-shadow-md text-center leading-tight tracking-tight"
      taglineStyle="absolute top-[22%] left-[10%] right-[10%] text-[10px] sm:text-xs font-sans font-bold text-yellow-300 uppercase tracking-[0.25em] text-center"
      detailsStyle="absolute top-[40%] left-[8%] right-[8%] text-xs font-serif italic text-white/95 text-center leading-relaxed px-6"
      ctaStyle="absolute bottom-[8%] left-[15%] right-[15%] text-center text-xs font-poppins font-bold text-white tracking-widest uppercase bg-transparent border-2 border-white/30 hover:border-white px-5 py-2.5 rounded transition-all"
      logoStyle="absolute top-[6%] left-[45%] w-10 h-10 rounded-full overflow-hidden border-2 border-white/30"
      imageStyle="absolute top-[60%] left-[35%] w-[120px] h-[70px] object-cover rounded shadow"
    />
  ),

  "restaurant-grand-opening": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Grey%20Black%20Bold%20Restaurant%20Grand%20Opening%20Promotion%20Poster.png" 
      headlineStyle="absolute top-[18%] left-[8%] right-[8%] text-3xl sm:text-4xl font-poppins font-black uppercase text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center tracking-tight leading-none"
      taglineStyle="absolute top-[35%] left-[10%] right-[10%] text-xs sm:text-sm font-poppins font-bold uppercase text-white tracking-widest text-center"
      detailsStyle="absolute top-[48%] left-[10%] right-[10%] text-xs font-sans font-semibold text-white/90 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-poppins font-black uppercase bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-3 px-6 rounded-md shadow-lg transition-all"
      logoStyle="absolute top-[6%] left-[45%] w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400/40 shadow-md bg-white/10"
      imageStyle="absolute top-[60%] left-[35%] w-[120px] h-[70px] object-cover rounded shadow"
    />
  ),

  // --- SALON POSTER TEMPLATES ---
  "salon-promo-pink": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Brown%20Modern%20Beauty%20Spa%20%26%20Salon%20Poster.png" 
      headlineStyle="absolute top-[20%] left-[8%] right-[8%] text-3xl font-playfair font-bold italic text-[#5C4033] text-center drop-shadow-xs tracking-tight leading-tight"
      taglineStyle="absolute top-[33%] left-[10%] right-[10%] text-[10px] uppercase tracking-[0.25em] text-[#8B7355] text-center font-semibold"
      detailsStyle="absolute top-[46%] left-[10%] right-[10%] text-xs font-sans text-[#7A6B58] text-center leading-relaxed px-4"
      ctaStyle="absolute bottom-[14%] left-[20%] right-[20%] text-center text-xs font-sans font-bold bg-[#5C4033] hover:bg-[#4a3328] text-white py-2.5 rounded-full tracking-wider shadow-sm transition-all"
      logoStyle="absolute top-[5%] left-[45%] w-10 h-10 rounded-full overflow-hidden border-2 border-[#5C4033]/20 shadow bg-white/20 backdrop-blur-xs"
      imageStyle="absolute top-[55%] left-[25%] w-[200px] h-[120px] object-cover rounded-xl shadow-md border border-[#5C4033]/10"
    />
  ),

  "salon-treatment-special": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Brown%20Modern%20Beauty%20Spa%20%26%20Salon%20Poster.png" 
      headlineStyle="absolute top-[12%] left-[10%] right-[10%] text-2xl font-playfair font-bold text-slate-800 text-left uppercase tracking-tight"
      taglineStyle="absolute top-[20%] left-[10%] text-[10px] tracking-widest text-pink-700 uppercase font-semibold"
      detailsStyle="absolute top-[38%] left-[10%] right-[15%] text-xs text-slate-600 leading-normal"
      ctaStyle="absolute bottom-[10%] left-[10%] text-xs font-mono font-bold text-slate-900 border-b-2 border-slate-900 hover:text-pink-600"
      logoStyle="absolute top-[5%] right-[5%] w-10 h-10 rounded-full overflow-hidden border border-slate-200"
      imageStyle="absolute top-[55%] right-[5%] w-[120px] h-[120px] object-cover rounded-lg border border-slate-200 shadow"
    />
  ),

  "salon-grand-opening": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20Gold%20and%20White%20Elegant%20Grand%20Reopening%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-3xl font-playfair font-black text-emerald-950 text-center tracking-tight leading-tight"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-[10px] tracking-[0.3em] uppercase text-emerald-800 font-bold text-center"
      detailsStyle="absolute top-[45%] left-[10%] right-[10%] text-xs font-serif italic text-emerald-900/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[10%] left-[15%] right-[15%] text-center text-xs font-sans font-extrabold uppercase tracking-widest bg-emerald-950 hover:bg-emerald-900 text-white py-3 rounded shadow transition-colors"
      logoStyle="absolute top-[5%] left-[45%] w-10 h-10 rounded-full overflow-hidden border border-gray-300"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded-lg shadow-xs"
    />
  ),

  "salon-hiring-stylist": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Pink%20Organic%20Makeup%20Artist%20Assistant%20Wanted%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-3xl font-fraunces font-extrabold text-pink-950 tracking-tight leading-none text-center"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-[10px] uppercase tracking-widest text-pink-700 font-bold text-center"
      detailsStyle="absolute top-[45%] left-[12%] right-[12%] text-xs font-sans text-pink-900/70 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-sans font-bold bg-pink-950 hover:bg-pink-900 text-white py-2.5 rounded-full shadow"
      logoStyle="absolute top-[4%] left-[4%] w-10 h-10 rounded-full overflow-hidden border bg-white/20"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "salon-discount-percent": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Red%20and%20Yellow%20Modern%20Flash%20Sale%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-4xl sm:text-5xl font-poppins font-black tracking-tighter uppercase text-white drop-shadow-[0_2px_8px_rgba(220,38,38,0.5)] text-center leading-none"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs sm:text-sm font-poppins font-extrabold uppercase text-yellow-300 tracking-widest text-center"
      detailsStyle="absolute top-[45%] left-[12%] right-[12%] text-xs font-sans font-bold text-white/95 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-poppins font-black uppercase bg-white hover:bg-gray-100 text-red-600 py-3 rounded-lg shadow-xl transition-all"
      logoStyle="absolute top-[4%] left-[4%] w-10 h-10 rounded-full overflow-hidden border border-red-500/20"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "salon-holiday-special": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20Gold%20and%20White%20Elegant%20Grand%20Reopening%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-3xl font-playfair font-black text-emerald-950 text-center tracking-tight leading-tight"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-[10px] tracking-[0.3em] uppercase text-emerald-800 font-bold text-center"
      detailsStyle="absolute top-[45%] left-[10%] right-[10%] text-xs font-serif italic text-emerald-900/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[10%] left-[15%] right-[15%] text-center text-xs font-sans font-extrabold uppercase tracking-widest bg-emerald-950 hover:bg-emerald-900 text-white py-3 rounded shadow transition-colors"
      logoStyle="absolute top-[5%] left-[45%] w-10 h-10 rounded-full overflow-hidden border border-gray-300"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded-lg shadow-xs"
    />
  ),

  // --- LOCAL SERVICES POSTER TEMPLATES ---
  "services-hiring-contractor": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Green%20and%20White%20Illustration%20Join%20Our%20Team%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-3xl sm:text-4xl font-poppins font-black uppercase text-emerald-900 text-center tracking-tight"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs font-poppins font-bold text-emerald-700 tracking-widest uppercase text-center"
      detailsStyle="absolute top-[45%] left-[10%] right-[10%] text-xs font-sans text-slate-600 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-poppins font-extrabold uppercase bg-emerald-800 hover:bg-emerald-700 text-white py-3 rounded-lg shadow transition-colors"
      logoStyle="absolute top-[4%] left-[4%] w-10 h-10 rounded-full overflow-hidden border border-yellow-500/20"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-promo-terracotta": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Black%20Blue%20and%20White%20Modern%20Handyman%20Service%20Poster.png" 
      headlineStyle="absolute top-[18%] left-[10%] right-[10%] text-3xl sm:text-4xl font-poppins font-black text-white uppercase tracking-tighter drop-shadow-md text-left"
      taglineStyle="absolute top-[28%] left-[10%] text-xs font-poppins font-bold text-blue-400 uppercase tracking-widest text-left"
      detailsStyle="absolute top-[42%] left-[10%] right-[15%] text-xs font-sans text-slate-300 leading-relaxed text-left max-w-[280px]"
      ctaStyle="absolute bottom-[15%] left-[10%] text-xs font-poppins font-bold uppercase tracking-wider bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-6 rounded shadow transition-all text-left inline-block"
      logoStyle="absolute top-[4%] right-[4%] w-10 h-10 rounded-full overflow-hidden border border-orange-700/20"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-guaranteed-trust": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Blue%20White%20Minimalist%20Health%20Care%20Service%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[8%] right-[8%] text-2xl sm:text-3xl font-poppins font-extrabold text-indigo-900 tracking-tight text-center uppercase"
      taglineStyle="absolute top-[26%] left-[10%] right-[10%] text-[10px] font-sans font-bold text-blue-600 tracking-widest uppercase text-center"
      detailsStyle="absolute top-[42%] left-[12%] right-[12%] text-xs font-sans text-slate-600 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-poppins font-bold uppercase bg-indigo-900 hover:bg-indigo-800 text-white py-2.5 rounded shadow transition-colors"
      logoStyle="absolute top-[4%] left-[4%] w-10 h-10 rounded-full overflow-hidden border"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-event-workspace": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Purple%20Bold%20Simple%20Painting%20Workshop%20Event%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-3xl sm:text-4xl font-poppins font-black text-white tracking-tighter uppercase text-center drop-shadow-md"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs font-poppins font-bold text-purple-200 tracking-widest uppercase text-center"
      detailsStyle="absolute top-[45%] left-[12%] right-[12%] text-xs font-sans text-white/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-poppins font-black bg-yellow-400 hover:bg-yellow-350 text-slate-900 py-3 rounded-full text-center shadow-lg transition-all"
      logoStyle="absolute top-[4%] left-[4%] w-10 h-10 rounded-full overflow-hidden border border-purple-200/20"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-discount-percent": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Creative%20Blue%20Fashion%20Special%20Offer%20(Poster).png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-3xl sm:text-4xl font-poppins font-black text-slate-950 uppercase tracking-tighter text-center leading-none"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-xs font-sans font-bold text-blue-600 tracking-widest uppercase text-center"
      detailsStyle="absolute top-[45%] left-[12%] right-[12%] text-xs font-sans text-slate-600 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-poppins font-bold bg-slate-950 hover:bg-slate-900 text-white py-2.5 rounded shadow transition-colors"
      logoStyle="absolute top-[4%] left-[4%] w-10 h-10 rounded-full overflow-hidden border"
      imageStyle="absolute top-[58%] left-[25%] w-[200px] h-[110px] object-cover rounded shadow"
    />
  ),

  "services-emergency-247": (props) => (
    <ImageOverlayPoster 
      {...props} 
      bgImage="/posters/Brown%20and%20Grey%20Modern%20Testimonial%20Reviews%20Poster.png" 
      headlineStyle="absolute top-[15%] left-[10%] right-[10%] text-2xl sm:text-3xl font-fraunces font-black text-amber-950 tracking-tight text-center leading-tight"
      taglineStyle="absolute top-[28%] left-[10%] right-[10%] text-[10px] font-sans font-bold text-amber-700 tracking-widest uppercase text-center"
      detailsStyle="absolute top-[45%] left-[12%] right-[12%] text-xs font-serif italic text-amber-900/80 text-center leading-relaxed"
      ctaStyle="absolute bottom-[12%] left-[15%] right-[15%] text-center text-xs font-sans font-bold bg-amber-950 hover:bg-amber-900 text-white py-2.5 rounded transition-all"
      logoStyle="absolute top-[4%] left-[4%] w-10 h-10 rounded-full overflow-hidden border"
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
