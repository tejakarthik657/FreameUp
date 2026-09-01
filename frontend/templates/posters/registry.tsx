'use client';

import React from 'react';
import type { Business } from '@/lib/types';

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
  aspect_ratio: '1:1' | '9:16' | 'A4';
}

export function getRatioClasses(aspect_ratio: '1:1' | '9:16' | 'A4') {
  switch (aspect_ratio) {
    case '9:16': return 'w-[360px] h-[640px]';
    case 'A4': return 'w-[420px] h-[594px]';
    case '1:1': default: return 'w-[450px] h-[450px]';
  }
}

/* ============================================================================
   DESIGN SYSTEM — shared primitives
   Every poster is built from the same small kit of decorative parts so the
   18 templates read as one considered product, not eighteen one-off pages.
   Each vertical (restaurant / salon / services) has its own token palette,
   defined as a comment block above its template group below.
============================================================================ */

/** Subtle photographic grain — keeps flat color fields from feeling flat/digital. */
const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <div
    className="absolute inset-0 pointer-events-none z-20"
    style={{
      opacity,
      mixBlendMode: 'overlay',
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    }}
  />
);

/** A soft, off-axis light wash — gives flat color backgrounds real depth. */
const LightWash: React.FC<{ color: string; x?: string; y?: string; size?: number; opacity?: number }> = ({
  color, x = '80%', y = '0%', size = 60, opacity = 0.35,
}) => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{ background: `radial-gradient(${size}% ${size}% at ${x} ${y}, ${color} 0%, transparent 70%)`, opacity }}
  />
);

/** Fine dot-grid texture, used behind hero copy on quieter backgrounds. */
const DotGrid: React.FC<{ color: string; opacity?: number; size?: number }> = ({ color, opacity = 0.5, size = 18 }) => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{ opacity, backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: `${size}px ${size}px` }}
  />
);

/** Four L-shaped corner brackets — reads as an intentional print frame, not a border. */
const CornerMarks: React.FC<{ color: string; inset?: number; size?: number; z?: number }> = ({
  color, inset = 14, size = 16, z = 20,
}) => (
  <div className="absolute inset-0 pointer-events-none" style={{ zIndex: z }}>
    <span className="absolute" style={{ top: inset, left: inset, width: size, height: size, borderTop: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}` }} />
    <span className="absolute" style={{ top: inset, right: inset, width: size, height: size, borderTop: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}` }} />
    <span className="absolute" style={{ bottom: inset, left: inset, width: size, height: size, borderBottom: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}` }} />
    <span className="absolute" style={{ bottom: inset, right: inset, width: size, height: size, borderBottom: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}` }} />
  </div>
);

/** A centered ornamental rule — diamond flanked by two hairlines. Used to separate copy blocks. */
const OrnamentRule: React.FC<{ color: string; className?: string }> = ({ color, className = '' }) => (
  <div className={`flex items-center justify-center gap-2 ${className}`}>
    <span className="h-px w-8" style={{ background: color, opacity: 0.6 }} />
    <span className="w-1.5 h-1.5 rotate-45" style={{ background: color }} />
    <span className="h-px w-8" style={{ background: color, opacity: 0.6 }} />
  </div>
);

/** Eyebrow / kicker pill — carries the tagline as a label, not a shouted headline. */
const Eyebrow: React.FC<{ children: React.ReactNode; className?: string; dot?: string }> = ({ children, className = '', dot }) => (
  <span className={`inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] uppercase ${className}`}>
    {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />}
    {children}
  </span>
);

/** Five-star rating glyph row, used on trust / testimonial-leaning templates. */
const Stars: React.FC<{ color?: string; size?: string }> = ({ color = '#C9A24B', size = 'text-sm' }) => (
  <div className={`flex gap-0.5 ${size}`} style={{ color, lineHeight: 1 }}>
    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
  </div>
);

/** Double-frame image treatment — an offset rule behind the photo, like a matte border. */
const FramedImage: React.FC<{ src: string; frameColor: string; radius?: string; ratio?: string; children?: React.ReactNode }> = ({
  src, frameColor, radius = 'rounded-lg', ratio = '', children,
}) => (
  <div className={`relative ${ratio}`}>
    <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 ${radius}`} style={{ border: `1px solid ${frameColor}`, opacity: 0.5 }} />
    <div className={`relative w-full h-full overflow-hidden ${radius}`}>
      <img src={src} alt="" className="w-full h-full object-cover" />
      {children}
    </div>
  </div>
);

/** Compact contact/footer row: logo chip + business line, used across every template. */
const FooterMeta: React.FC<{ logo?: string; textColor: string; ringColor: string; label?: string }> = ({ logo, textColor, ringColor, label }) => (
  <div className="flex items-center gap-2">
    {logo && (
      <img src={logo} alt="logo" className="w-8 h-8 rounded-full object-cover" style={{ border: `1px solid ${ringColor}` }} />
    )}
    {label && <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: textColor }}>{label}</span>}
  </div>
);

const Watermark: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div
    className={`absolute bottom-3 right-3 text-[7px] font-medium tracking-[0.15em] ${dark ? 'text-white/45' : 'text-black/30'} uppercase select-none pointer-events-none z-30`}
  >
    Designed by DevFrames
  </div>
);

/* ============================================================================
   RESTAURANT TEMPLATES
   Tokens — ink #1C1B19 · ivory #F6F1E9 · clay #B5563C · wine #5C1F2E
            olive #656B45 · gold #C9A24B
   Type — display: font-fraunces (serif)  ·  body: font-sans
============================================================================ */

const RestaurantPromoBold = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#F6F1E9] text-[#1C1B19] ${getRatioClasses(aspect_ratio)} flex flex-col`}>
    <LightWash color="#B5563C" x="90%" y="-10%" opacity={0.14} />
    <DotGrid color="#1C1B19" opacity={0.05} />
    <Grain opacity={0.04} />
    <CornerMarks color="#1C1B19" inset={12} />

    <div className="relative z-10 px-8 pt-8 pb-2 flex items-start justify-between">
      <div>
        <Eyebrow className="text-[#B5563C]" dot="#B5563C">{content.tagline}</Eyebrow>
      </div>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-full object-cover border border-[#1C1B19]/15 shadow-sm" />
      )}
    </div>

    <div className="relative z-10 px-8 mt-3">
      <h1 className="font-fraunces text-[2.55rem] font-medium leading-[0.94] tracking-tight">{content.headline}</h1>
      <div className="flex items-center gap-3 mt-4">
        <span className="h-px w-10 bg-[#B5563C]" />
        <span className="text-[10px] tracking-[0.14em] uppercase text-[#1C1B19]/50">Fresh · Seasonal · Local</span>
      </div>
    </div>

    {content.image_url ? (
      <div className="relative z-10 flex-grow mx-8 mt-5 mb-5">
        <FramedImage src={content.image_url} frameColor="#B5563C" radius="rounded-sm" ratio="w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/55 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 bg-[#F6F1E9] text-[#1C1B19] text-[11px] font-semibold tracking-wide px-3.5 py-1.5 rounded-full shadow">
            {content.cta}
          </span>
        </FramedImage>
      </div>
    ) : (
      <div className="relative z-10 flex-grow" />
    )}

    <div className="relative z-10 px-8 pb-6 pt-4 border-t border-[#1C1B19]/10 flex items-end justify-between gap-4">
      <p className="text-[11px] text-[#1C1B19]/65 leading-relaxed max-w-[70%]">{content.details}</p>
      {!content.image_url && (
        <span className="shrink-0 bg-[#1C1B19] text-[#F6F1E9] text-[11px] font-semibold px-4 py-2 rounded-full">{content.cta}</span>
      )}
    </div>
    <Watermark />
  </div>
);

const RestaurantMenuSpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#3A1620] text-[#F3E7D8] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#C9A24B" x="15%" y="10%" opacity={0.22} />
    <LightWash color="#8A2E42" x="90%" y="95%" opacity={0.35} />
    <Grain opacity={0.07} />
    <div className="absolute inset-3 border border-[#C9A24B]/30 pointer-events-none z-10" />
    <CornerMarks color="#C9A24B" inset={20} size={12} />

    <div className="relative z-20 flex justify-between items-start mb-2">
      {content.logo_url ? (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-[#C9A24B]/60 object-cover" />
      ) : <span />}
      <Eyebrow className="text-[#C9A24B] text-right">{content.tagline}</Eyebrow>
    </div>

    <div className="relative z-20 flex-grow flex flex-col items-center text-center justify-center px-2">
      <h1 className="font-fraunces italic text-4xl leading-[1.08] text-[#F3E7D8] max-w-[92%]">{content.headline}</h1>
      <OrnamentRule color="#C9A24B" className="my-5" />
      {content.image_url && (
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full border border-[#C9A24B]/25 scale-110" />
          <div className="w-40 h-40 rounded-full overflow-hidden border border-[#C9A24B]/50">
            <img src={content.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
      <p className="text-[12px] font-light text-[#F3E7D8]/75 leading-relaxed max-w-[85%]">{content.details}</p>
    </div>

    <div className="relative z-20 flex flex-col items-center gap-3 pt-4">
      <span className="border border-[#C9A24B] text-[#C9A24B] text-[11px] font-medium tracking-[0.08em] px-7 py-2.5 rounded-full">
        {content.cta}
      </span>
    </div>
    <Watermark dark />
  </div>
);

const RestaurantEventDinner = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1C1210] text-[#F3E7D8] ${getRatioClasses(aspect_ratio)} flex flex-col`}>
    <LightWash color="#E0793C" x="20%" y="0%" opacity={0.25} />
    <Grain opacity={0.06} />

    {content.image_url && (
      <div className="h-[45%] w-full relative z-10">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1210] via-[#1C1210]/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1210]/50 via-transparent to-transparent" />
      </div>
    )}

    <div className={`relative z-10 px-7 flex-grow flex flex-col justify-end pb-7 ${!content.image_url ? 'justify-center pt-7' : 'pt-4'}`}>
      <Eyebrow className="text-[#C9A24B] mb-3">{content.tagline}</Eyebrow>
      <h1 className="font-fraunces text-[2.5rem] font-medium leading-[0.94] mb-4 max-w-[92%]">{content.headline}</h1>
      <div className="border-l-2 border-[#C9A24B] pl-4 mb-6">
        <p className="text-[12px] font-light text-[#F3E7D8]/70 leading-relaxed max-w-[90%]">{content.details}</p>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-[#F3E7D8]/15">
        <span className="text-[#C9A24B] text-[11px] font-semibold tracking-[0.1em] uppercase">{content.cta}</span>
        <FooterMeta logo={content.logo_url} textColor="#F3E7D8" ringColor="rgba(201,162,75,0.5)" />
      </div>
    </div>
    <Watermark dark />
  </div>
);

const RestaurantHiringChef = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1C1B19] text-[#F6F1E9] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#656B45" x="100%" y="100%" opacity={0.3} />
    <DotGrid color="#F6F1E9" opacity={0.04} />
    <Grain opacity={0.05} />

    <div className="relative z-10 flex justify-between items-start mb-7">
      <Eyebrow className="text-[#C9A24B] border border-[#C9A24B]/40 rounded-full px-3 py-1.5">{content.tagline}</Eyebrow>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover border border-white/20" />
      )}
    </div>

    <h1 className="relative z-10 font-fraunces text-[2.85rem] font-medium leading-[0.9] mb-1">{content.headline}</h1>
    <p className="relative z-10 text-[11px] uppercase tracking-[0.16em] text-white/40 mb-6">Now interviewing — apply within</p>

    {content.image_url ? (
      <div className="relative z-10 flex-grow mb-6">
        <FramedImage src={content.image_url} frameColor="#C9A24B" radius="rounded-sm" ratio="w-full h-full" />
      </div>
    ) : (
      <div className="relative z-10 flex-grow" />
    )}

    <div className="relative z-10 flex items-end justify-between pt-5 border-t border-white/15 gap-4">
      <p className="text-[11px] text-white/65 leading-relaxed max-w-[58%]">{content.details}</p>
      <span className="shrink-0 bg-[#C9A24B] text-[#1C1B19] font-semibold text-[12px] px-5 py-2.5 rounded-full">{content.cta}</span>
    </div>
    <Watermark dark />
  </div>
);

const RestaurantDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#5C1F2E] text-[#F6F1E9] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center`}>
    <LightWash color="#E0793C" x="50%" y="0%" opacity={0.28} />
    <Grain opacity={0.06} />
    <CornerMarks color="#E8B4A0" inset={16} size={12} />

    {content.logo_url && (
      <img src={content.logo_url} alt="logo" className="absolute top-6 left-6 w-10 h-10 rounded-full border border-white/40 object-cover z-20" />
    )}

    <Eyebrow className="relative z-10 text-[#E8B4A0] mt-3 mb-5">{content.tagline}</Eyebrow>

    <h1 className="relative z-10 font-fraunces text-[3.4rem] font-medium leading-[0.88] mb-2">{content.headline}</h1>
    <OrnamentRule color="#E8B4A0" className="relative z-10 my-4" />

    {content.image_url ? (
      <div className="relative z-10 w-full flex-grow my-2">
        <FramedImage src={content.image_url} frameColor="#E8B4A0" radius="rounded-sm" ratio="w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-[#5C1F2E]/75 to-transparent" />
        </FramedImage>
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <p className="relative z-10 text-[12px] font-light text-[#F6F1E9]/80 my-5 max-w-[85%] leading-relaxed">{content.details}</p>

    <span className="relative z-10 bg-[#F6F1E9] text-[#5C1F2E] font-semibold text-sm px-9 py-3 rounded-full mb-2 shadow-lg">
      {content.cta}
    </span>
    <Watermark dark />
  </div>
);

const RestaurantGrandOpening = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#F6F1E9] text-[#26311F] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#656B45" x="10%" y="100%" opacity={0.15} />
    <Grain opacity={0.04} />
    <div className="absolute inset-2.5 border border-[#26311F]/15 pointer-events-none z-10" />
    <CornerMarks color="#C9A24B" inset={16} size={14} />

    <div className="relative z-20 text-center pt-3">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-full object-cover mx-auto mb-4 border-2 border-[#C9A24B]" />
      )}
      <Eyebrow className="text-[#656B45] justify-center mb-3">{content.tagline}</Eyebrow>
      <h1 className="font-fraunces text-[2.1rem] font-medium leading-tight px-4">{content.headline}</h1>
    </div>

    {content.image_url ? (
      <div className="relative z-20 flex-grow my-5 mx-6">
        <FramedImage src={content.image_url} frameColor="#26311F" radius="rounded-sm" ratio="w-full h-full" />
      </div>
    ) : <div className="relative z-20 flex-grow" />}

    <div className="relative z-20 text-center pb-3">
      <OrnamentRule color="#26311F" className="mb-4" />
      <p className="text-[11px] text-[#26311F]/65 mb-5 px-6 leading-relaxed">{content.details}</p>
      <span className="inline-block bg-[#26311F] text-[#C9A24B] text-[11px] font-semibold tracking-[0.08em] px-7 py-2.5 rounded-full">
        {content.cta}
      </span>
    </div>
    <Watermark />
  </div>
);

/* ============================================================================
   SALON TEMPLATES
   Tokens — plum #3A2436 · blush #EFE3DA · mocha #7A5C4C
            champagne gold #C9A24B · rose #B98C86
   Type — display: font-playfair (serif)  ·  body: font-sans
============================================================================ */

const SalonPromoPink = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#EFE3DA] text-[#3A2436] ${getRatioClasses(aspect_ratio)} p-5 flex flex-col`}>
    <LightWash color="#B98C86" x="0%" y="0%" opacity={0.3} />
    <div className="relative z-10 bg-[#FBF7F3] flex-grow rounded-2xl p-7 flex flex-col shadow-[0_18px_44px_-18px_rgba(58,36,54,0.28)] overflow-hidden">
      <Grain opacity={0.03} />
      <div className="flex justify-between items-start mb-6">
        {content.logo_url && (
          <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-[#C9A24B]/50 object-cover" />
        )}
        <Eyebrow className="text-[#7A5C4C] ml-auto text-right">{content.tagline}</Eyebrow>
      </div>

      <h1 className="font-playfair text-4xl italic leading-[1.05] text-[#3A2436] mb-2">{content.headline}</h1>
      <div className="w-10 h-px bg-[#C9A24B] mb-6" />

      {content.image_url ? (
        <div className="flex-grow mb-6">
          <FramedImage src={content.image_url} frameColor="#C9A24B" radius="rounded-xl" ratio="w-full h-full" />
        </div>
      ) : <div className="flex-grow" />}

      <div className="bg-[#EFE3DA]/50 rounded-xl px-4 py-3 mb-6">
        <p className="text-[11px] text-[#3A2436]/65 leading-relaxed">{content.details}</p>
      </div>

      <button className="w-full bg-[#3A2436] text-[#EFE3DA] py-3.5 rounded-full font-medium text-sm tracking-wide">
        {content.cta}
      </button>
    </div>
    <Watermark />
  </div>
);

const SalonTreatmentSpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#3A2436] text-[#F3E9E4] ${getRatioClasses(aspect_ratio)} p-8 flex flex-col items-center text-center`}>
    <LightWash color="#C9A24B" x="50%" y="0%" opacity={0.2} />
    <Grain opacity={0.06} />
    <div className="absolute inset-4 border border-[#C9A24B]/30 pointer-events-none z-10" />
    <CornerMarks color="#C9A24B" inset={26} size={10} />

    <div className="relative z-20 flex flex-col items-center h-full w-full justify-between">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover mt-3 border border-[#C9A24B]/50" />
      )}

      <div>
        <Eyebrow className="text-[#C9A24B] justify-center mb-3">{content.tagline}</Eyebrow>
        <h1 className="font-playfair text-3xl leading-snug max-w-[90%] mx-auto">{content.headline}</h1>
      </div>

      {content.image_url && (
        <div className="relative">
          <div className="absolute inset-0 rounded-full border border-[#C9A24B]/25 scale-110" />
          <div className="w-44 h-44 rounded-full overflow-hidden border border-[#C9A24B]/40">
            <img src={content.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div>
        <OrnamentRule color="#C9A24B" className="mb-4" />
        <p className="text-[11px] font-light text-[#F3E9E4]/70 max-w-[85%] mx-auto mb-5 leading-relaxed">{content.details}</p>
        <span className="text-[11px] tracking-[0.15em] border-b border-[#C9A24B] text-[#C9A24B] pb-1">{content.cta}</span>
      </div>
    </div>
    <Watermark dark />
  </div>
);

const SalonGrandOpening = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#2B1A28] text-[#F3E9E4] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center`}>
    <LightWash color="#C9A24B" x="20%" y="90%" opacity={0.22} />
    <Grain opacity={0.06} />
    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent z-20" />
    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent z-20" />

    <div className="relative z-20 flex flex-col items-center w-full h-full justify-center">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-full border border-[#C9A24B]/60 object-cover mb-5" />
      )}
      <Eyebrow className="text-[#C9A24B] mb-3">{content.tagline}</Eyebrow>
      <h1 className="font-playfair text-[2.3rem] leading-tight mb-6 max-w-[90%]">{content.headline}</h1>

      {content.image_url && (
        <div className="w-full h-40 mb-6">
          <FramedImage src={content.image_url} frameColor="#C9A24B" radius="rounded-sm" ratio="w-full h-full" />
        </div>
      )}

      <p className="text-[11px] font-light text-[#F3E9E4]/65 mb-6 px-4 leading-relaxed">{content.details}</p>

      <span className="border border-[#C9A24B] text-[#C9A24B] px-7 py-2.5 rounded-full text-[11px] tracking-[0.1em] font-medium">
        {content.cta}
      </span>
    </div>
    <Watermark dark />
  </div>
);

const SalonHiringStylist = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#FBF3F0] text-[#3A2436] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#B98C86" x="100%" y="0%" opacity={0.25} />
    <Grain opacity={0.03} />

    <div className="relative z-10 flex justify-between items-center mb-7">
      <Eyebrow className="text-[#B98C86]">{content.tagline}</Eyebrow>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full object-cover border border-[#B98C86]/40" />
      )}
    </div>

    <h1 className="relative z-10 font-playfair text-4xl leading-[1.08] mb-1">{content.headline}</h1>
    <p className="relative z-10 text-[10px] uppercase tracking-[0.16em] text-[#3A2436]/40 mb-6">We're growing our chair family</p>

    {content.image_url ? (
      <div className="relative z-10 flex-grow mb-6 rounded-2xl overflow-hidden shadow-[0_18px_36px_-18px_rgba(58,36,54,0.3)]">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <div className="relative z-10 border-t border-[#3A2436]/10 pt-5 flex items-end justify-between gap-4">
      <p className="text-[11px] text-[#3A2436]/65 leading-relaxed">{content.details}</p>
      <span className="shrink-0 bg-[#3A2436] text-[#F3E9E4] text-[11px] font-medium px-5 py-2.5 rounded-full">
        {content.cta}
      </span>
    </div>
    <Watermark />
  </div>
);

const SalonDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#4A2038] text-[#F3E9E4] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#C9A24B" x="90%" y="10%" opacity={0.22} />
    <Grain opacity={0.06} />

    <div className="relative z-10 flex justify-between items-start mb-6">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-white/25 object-cover" />
      )}
      <span className="bg-[#C9A24B] text-[#3A2436] text-[10px] font-semibold px-3.5 py-1.5 rounded-full tracking-wide ml-auto">
        {content.tagline}
      </span>
    </div>

    <h1 className="relative z-10 font-playfair text-5xl leading-[0.95] mb-6">{content.headline}</h1>

    {content.image_url ? (
      <div className="relative z-10 flex-grow mb-6 rounded-xl overflow-hidden">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4A2038]/40 to-transparent" />
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <div className="relative z-10 bg-white/8 rounded-xl px-4 py-3 mb-5 border border-white/10">
      <p className="text-[11px] font-light text-[#F3E9E4]/75 leading-relaxed">{content.details}</p>
    </div>

    <button className="relative z-10 w-full bg-[#F3E9E4] text-[#3A2436] font-semibold text-sm py-3.5 rounded-full">
      {content.cta}
    </button>
    <Watermark dark />
  </div>
);

const SalonHolidaySpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#3E1723] text-[#F3E7D8] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#C9A24B" x="50%" y="100%" opacity={0.2} />
    <Grain opacity={0.06} />
    <div className="absolute inset-3 border border-[#C9A24B]/30 pointer-events-none z-10" />
    <CornerMarks color="#C9A24B" inset={20} size={12} />

    <div className="relative z-20 flex flex-col items-center text-center h-full">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-[#C9A24B]/60 object-cover mt-2 mb-5" />
      )}

      <h1 className="font-playfair italic text-4xl mb-2 text-[#C9A24B] max-w-[90%]">{content.headline}</h1>
      <Eyebrow className="text-[#F3E7D8]/70 mb-6">{content.tagline}</Eyebrow>

      {content.image_url ? (
        <div className="flex-grow w-full mb-6">
          <FramedImage src={content.image_url} frameColor="#C9A24B" radius="rounded-sm" ratio="w-full h-full" />
        </div>
      ) : <div className="flex-grow" />}

      <OrnamentRule color="#C9A24B" className="mb-5" />
      <p className="text-[11px] font-light text-[#F3E7D8]/70 mb-6 px-4 leading-relaxed">{content.details}</p>
      <span className="bg-[#C9A24B] text-[#3E1723] px-7 py-2.5 rounded-full text-[11px] font-semibold tracking-wide">
        {content.cta}
      </span>
    </div>
    <Watermark dark />
  </div>
);

/* ============================================================================
   LOCAL SERVICES TEMPLATES
   Tokens — navy #14213D · steel #3E5C76 · slate #EDF1F5 · signal #E0793C · white
   Type — display: font-inter (bold sans)  ·  body: font-sans  ·  meta: font-mono
============================================================================ */

const ServicesHiringContractor = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#EDF1F5] text-[#14213D] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#3E5C76" x="100%" y="0%" opacity={0.18} />
    <DotGrid color="#14213D" opacity={0.04} />

    <div className="relative z-10 flex items-center justify-between mb-7">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-lg object-cover border border-[#14213D]/10 bg-white" />
      )}
      <span className="text-[10px] font-semibold tracking-[0.14em] text-[#3E5C76] bg-white px-3.5 py-1.5 rounded-full border border-[#14213D]/10 ml-auto uppercase">
        {content.tagline}
      </span>
    </div>

    <h1 className="relative z-10 font-inter text-[2.5rem] font-bold leading-[0.94] tracking-tight mb-1">{content.headline}</h1>
    <p className="relative z-10 font-mono text-[10px] tracking-widest text-[#3E5C76] uppercase mb-6">Licensed · Insured · Local</p>

    {content.image_url ? (
      <div className="relative z-10 flex-grow mb-6 rounded-xl overflow-hidden">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <div className="relative z-10 flex items-end justify-between gap-4 pt-4 border-t border-[#14213D]/10">
      <p className="text-[11px] text-[#14213D]/60 leading-relaxed">{content.details}</p>
      <button className="shrink-0 bg-[#14213D] text-white px-5 py-3 rounded-lg font-semibold text-[12px]">
        {content.cta}
      </button>
    </div>
    <Watermark />
  </div>
);

const ServicesPromoTerracotta = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#14213D] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#E0793C" x="100%" y="10%" opacity={0.25} />
    <Grain opacity={0.04} />

    <div className="relative z-10 flex justify-between items-start mb-7">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 bg-white rounded-lg p-1.5 object-cover" />
      )}
      <span className="text-[#E0793C] text-[10px] font-semibold tracking-[0.16em] uppercase ml-auto text-right">{content.tagline}</span>
    </div>

    <h1 className="relative z-10 font-inter text-[2.6rem] font-bold leading-[0.9] mb-6 max-w-[85%]">{content.headline}</h1>

    {content.image_url ? (
      <div className="relative z-10 flex-grow rounded-xl overflow-hidden mb-6 border-l-2 border-[#E0793C]">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <div className="relative z-10 flex items-end justify-between pt-5 border-t border-white/10">
      <p className="text-[11px] text-white/55 max-w-[60%] leading-relaxed">{content.details}</p>
      <button className="bg-[#E0793C] text-[#14213D] font-semibold text-[12px] px-5 py-3 rounded-lg">
        {content.cta}
      </button>
    </div>
    <Watermark dark />
  </div>
);

const ServicesGuaranteedTrust = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-white text-[#14213D] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center border-t-[6px] border-[#3E5C76]`}>
    <DotGrid color="#3E5C76" opacity={0.06} />

    {content.logo_url && (
      <img src={content.logo_url} alt="logo" className="relative z-10 w-14 h-14 rounded-xl border border-[#14213D]/10 object-cover mt-5 mb-4" />
    )}

    <Stars color="#E0793C" />
    <p className="relative z-10 text-[#3E5C76] font-semibold tracking-[0.14em] text-[10px] mt-2 mb-2 uppercase">{content.tagline}</p>
    <h1 className="relative z-10 font-inter text-[2.1rem] font-bold leading-tight mb-6 px-2">{content.headline}</h1>

    {content.image_url ? (
      <div className="relative z-10 w-full flex-grow rounded-xl overflow-hidden mb-5 relative">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 w-full bg-[#14213D]/85 text-white text-[10px] font-semibold py-2 tracking-wide uppercase">
          Verified Professional
        </div>
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <p className="relative z-10 text-[11px] text-[#14213D]/60 mb-5 px-2 leading-relaxed">{content.details}</p>

    <button className="relative z-10 w-full bg-[#14213D] text-white py-3.5 rounded-lg font-semibold text-[12px] mb-6">
      {content.cta}
    </button>
    <Watermark />
  </div>
);

const ServicesEventWorkspace = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1B2540] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#E0793C" x="0%" y="100%" opacity={0.18} />
    <LightWash color="#3E5C76" x="100%" y="0%" opacity={0.22} />
    <Grain opacity={0.04} />

    <div className="relative z-10 flex justify-between items-center mb-6">
      <span className="bg-white/10 border border-white/15 text-white text-[10px] font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase">
        {content.tagline}
      </span>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-white/25 object-cover" />
      )}
    </div>

    <h1 className="relative z-10 font-inter text-[2.4rem] font-bold leading-[1.05] mb-6">{content.headline}</h1>

    {content.image_url ? (
      <div className="relative z-10 flex-grow rounded-xl overflow-hidden mb-6 relative">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1B2540]/15" />
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <div className="relative z-10 flex items-center justify-between bg-white/8 p-4 rounded-xl border border-white/10 mt-auto">
      <p className="text-[11px] text-white/70 w-2/3 pr-4 border-r border-white/15 leading-relaxed">{content.details}</p>
      <span className="text-[#E0793C] font-semibold text-[12px] pl-4">{content.cta} &rarr;</span>
    </div>
    <Watermark dark />
  </div>
);

const ServicesDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#14213D] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#E0793C" x="15%" y="0%" opacity={0.25} />
    <Grain opacity={0.04} />

    <div className="relative z-10 flex justify-between items-start mb-6">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-lg bg-white p-1 object-cover" />
      )}
      <span className="text-[#E0793C] font-semibold text-[11px] tracking-wide uppercase border-b border-[#E0793C] pb-1 ml-auto">
        {content.tagline}
      </span>
    </div>

    <h1 className="relative z-10 font-inter text-[3.4rem] font-bold leading-[0.9] mb-6">{content.headline}</h1>

    {content.image_url ? (
      <div className="relative z-10 flex-grow rounded-xl overflow-hidden mb-6 relative">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <div className="relative z-10 mt-auto">
      <p className="text-[11px] text-white/65 mb-4 leading-relaxed">{content.details}</p>
      <button className="w-full bg-[#E0793C] text-[#14213D] py-3.5 rounded-lg font-bold text-[15px]">
        {content.cta}
      </button>
    </div>
    <Watermark dark />
  </div>
);

const ServicesEmergency247 = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#14213D] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#C4432B" x="80%" y="0%" opacity={0.28} />
    <Grain opacity={0.04} />

    <div className="relative z-10 flex justify-between items-center mb-6">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-white/25 object-cover" />
      )}
      <span className="bg-[#C4432B] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-md flex items-center gap-1.5 ml-auto">
        <span className="w-1.5 h-1.5 bg-white rounded-full" /> {content.tagline}
      </span>
    </div>

    <h1 className="relative z-10 font-inter text-[2.3rem] font-bold leading-[1] mb-6">{content.headline}</h1>

    <div className="relative z-10 bg-white text-[#14213D] flex-grow p-5 rounded-xl shadow-lg flex flex-col">
      {content.image_url && (
        <div className="w-full h-36 rounded-lg overflow-hidden mb-4">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <Stars color="#E0793C" size="text-base" />
      <p className="text-[12px] text-[#14213D]/70 leading-relaxed border-l-2 border-[#C4432B] pl-3 mt-2 mb-auto">{content.details}</p>

      <button className="w-full bg-[#14213D] text-white py-3 mt-4 rounded-lg font-semibold text-[12px] tracking-wide">
        {content.cta}
      </button>
    </div>
    <Watermark dark />
  </div>
);


export const POSTER_REGISTRY: Record<string, React.FC<PosterProps>> = {
  // Restaurant
  'restaurant-promo-bold': RestaurantPromoBold,
  'restaurant-menu-special': RestaurantMenuSpecial,
  'restaurant-event-dinner': RestaurantEventDinner,
  'restaurant-hiring-chef': RestaurantHiringChef,
  'restaurant-discount-percent': RestaurantDiscountPercent,
  'restaurant-grand-opening': RestaurantGrandOpening,
  // Salon
  'salon-promo-pink': SalonPromoPink,
  'salon-treatment-special': SalonTreatmentSpecial,
  'salon-grand-opening': SalonGrandOpening,
  'salon-hiring-stylist': SalonHiringStylist,
  'salon-discount-percent': SalonDiscountPercent,
  'salon-holiday-special': SalonHolidaySpecial,
  // Local Services
  'services-hiring-contractor': ServicesHiringContractor,
  'services-promo-terracotta': ServicesPromoTerracotta,
  'services-guaranteed-trust': ServicesGuaranteedTrust,
  'services-event-workspace': ServicesEventWorkspace,
  'services-discount-percent': ServicesDiscountPercent,
  'services-emergency-247': ServicesEmergency247,
};

export function getPosterTemplate(templateId: string): React.FC<PosterProps> {
  const Component = POSTER_REGISTRY[templateId];
  if (Component) return Component;
  if (templateId.startsWith('restaurant-')) return POSTER_REGISTRY['restaurant-promo-bold'];
  if (templateId.startsWith('salon-')) return POSTER_REGISTRY['salon-promo-pink'];
  return POSTER_REGISTRY['services-hiring-contractor'];
}