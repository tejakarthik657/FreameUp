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

const Watermark = ({ dark }: { dark?: boolean }) => (
  <div
    className={`absolute bottom-3 right-3 text-[7px] font-medium tracking-[0.15em] ${dark ? 'text-white/50' : 'text-black/35'} uppercase select-none pointer-events-none z-30`}
  >
    Designed by DevFrames
  </div>
);

// ----------------------------------------------------------------------
// RESTAURANT TEMPLATES
// Palette: ink #1C1B19, ivory #F6F1E9, clay #B5563C, olive #656B45, gold #C9A24B, wine #5C1F2E
// Type: font-fraunces (display serif) + font-sans (body)
// ----------------------------------------------------------------------

const RestaurantPromoBold = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#F6F1E9] text-[#1C1B19] ${getRatioClasses(aspect_ratio)} flex flex-col`}>
    <div className="px-7 pt-7 pb-5 flex items-start justify-between">
      <p className="text-[11px] font-medium tracking-[0.14em] text-[#B5563C] max-w-[65%] leading-snug">{content.tagline}</p>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover border border-[#1C1B19]/15" />
      )}
    </div>

    <div className="px-7">
      <h1 className="font-fraunces text-[2.6rem] font-medium leading-[0.95] tracking-tight">{content.headline}</h1>
      <div className="w-14 h-[3px] bg-[#B5563C] mt-4" />
    </div>

    {content.image_url && (
      <div className="flex-grow mx-7 mt-5 mb-4 relative rounded-sm overflow-hidden">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/50 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 bg-[#F6F1E9] text-[#1C1B19] text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full">
          {content.cta}
        </span>
      </div>
    )}

    <div className="px-7 pb-6 pt-4 border-t border-[#1C1B19]/10 flex items-end justify-between">
      <p className="text-[11px] text-[#1C1B19]/70 leading-relaxed max-w-[75%]">{content.details}</p>
      {!content.image_url && (
        <span className="bg-[#1C1B19] text-[#F6F1E9] text-[11px] font-semibold px-4 py-2 rounded-full">{content.cta}</span>
      )}
    </div>
    <Watermark />
  </div>
);

const RestaurantMenuSpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#3A1620] text-[#F3E7D8] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <div className="absolute inset-3 border border-[#C9A24B]/35 pointer-events-none" />

    <div className="relative z-10 flex justify-between items-start mb-6">
      {content.logo_url ? (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-[#C9A24B]/60 object-cover" />
      ) : <span />}
      <p className="text-[10px] tracking-[0.2em] text-[#C9A24B] text-right">{content.tagline}</p>
    </div>

    <div className="relative z-10 flex-grow flex flex-col items-center text-center justify-center px-2">
      <h1 className="font-fraunces italic text-4xl leading-tight text-[#F3E7D8]">{content.headline}</h1>
      <div className="w-10 h-px bg-[#C9A24B] my-5" />
      {content.image_url && (
        <div className="w-40 h-40 rounded-full overflow-hidden border border-[#C9A24B]/50 mb-5">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <p className="text-[12px] font-light text-[#F3E7D8]/75 leading-relaxed max-w-[85%]">{content.details}</p>
    </div>

    <div className="relative z-10 flex justify-center pt-4">
      <span className="border border-[#C9A24B] text-[#C9A24B] text-[11px] font-medium tracking-wide px-6 py-2.5 rounded-full">
        {content.cta}
      </span>
    </div>
    <Watermark dark />
  </div>
);

const RestaurantEventDinner = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1C1210] text-[#F3E7D8] ${getRatioClasses(aspect_ratio)} flex flex-col`}>
    {content.image_url && (
      <div className="h-[46%] w-full relative">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1210] via-[#1C1210]/10 to-transparent" />
      </div>
    )}
    <div className={`px-7 flex-grow flex flex-col justify-end pb-7 ${!content.image_url ? 'justify-center pt-7' : 'pt-4'}`}>
      <p className="text-[#C9A24B] text-[10px] tracking-[0.2em] mb-3">{content.tagline}</p>
      <h1 className="font-fraunces text-[2.5rem] font-medium leading-[0.95] mb-4">{content.headline}</h1>
      <p className="text-[12px] font-light text-[#F3E7D8]/70 mb-6 max-w-[90%] leading-relaxed">{content.details}</p>
      <div className="flex justify-between items-center pt-4 border-t border-[#F3E7D8]/15">
        <span className="text-[#C9A24B] text-[11px] font-semibold tracking-wide">{content.cta}</span>
        {content.logo_url && (
          <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-[#C9A24B]/50 object-cover" />
        )}
      </div>
    </div>
    <Watermark dark />
  </div>
);

const RestaurantHiringChef = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1C1B19] text-[#F6F1E9] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <div className="flex justify-between items-start mb-8">
      <span className="text-[10px] tracking-[0.2em] text-[#C9A24B] border border-[#C9A24B]/40 rounded-full px-3 py-1">
        {content.tagline}
      </span>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover border border-white/20" />
      )}
    </div>

    <h1 className="font-fraunces text-[2.9rem] font-medium leading-[0.92] mb-6">{content.headline}</h1>

    {content.image_url && (
      <div className="flex-grow relative mb-6 rounded-sm overflow-hidden">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}

    <div className="flex items-end justify-between pt-5 border-t border-white/15">
      <p className="text-[11px] text-white/65 leading-relaxed max-w-[60%]">{content.details}</p>
      <span className="bg-[#C9A24B] text-[#1C1B19] font-semibold text-[12px] px-5 py-2.5 rounded-full">{content.cta}</span>
    </div>
    <Watermark dark />
  </div>
);

const RestaurantDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#5C1F2E] text-[#F6F1E9] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center`}>
    <p className="text-[10px] tracking-[0.22em] text-[#E8B4A0] mt-2 mb-4">{content.tagline}</p>

    <h1 className="font-fraunces text-6xl font-medium leading-none mb-5">{content.headline}</h1>

    {content.image_url && (
      <div className="w-full flex-grow rounded-sm overflow-hidden mb-5 relative">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5C1F2E]/70 to-transparent" />
      </div>
    )}

    <p className="text-[12px] font-light text-[#F6F1E9]/80 mb-6 max-w-[85%] leading-relaxed">{content.details}</p>

    <span className="bg-[#F6F1E9] text-[#5C1F2E] font-semibold text-sm px-8 py-3 rounded-full mb-2">{content.cta}</span>

    {content.logo_url && (
      <img src={content.logo_url} alt="logo" className="absolute top-6 left-6 w-10 h-10 rounded-full border border-white/40 object-cover" />
    )}
    <Watermark dark />
  </div>
);

const RestaurantGrandOpening = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#F6F1E9] text-[#26311F] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <div className="absolute inset-2.5 border border-[#26311F]/15 pointer-events-none" />

    <div className="relative z-10 text-center pt-3">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover mx-auto mb-4 border border-[#C9A24B]" />
      )}
      <p className="text-[10px] tracking-[0.22em] text-[#656B45] mb-2">{content.tagline}</p>
      <h1 className="font-fraunces text-[2.1rem] font-medium leading-tight px-4">{content.headline}</h1>
    </div>

    {content.image_url && (
      <div className="flex-grow my-5 mx-6 rounded-sm overflow-hidden relative z-10">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}

    <div className="relative z-10 text-center pb-3">
      <p className="text-[11px] text-[#26311F]/65 mb-5 px-6 leading-relaxed">{content.details}</p>
      <span className="inline-block bg-[#26311F] text-[#C9A24B] text-[11px] font-semibold tracking-wide px-6 py-2.5 rounded-full">
        {content.cta}
      </span>
    </div>
    <Watermark />
  </div>
);

// ----------------------------------------------------------------------
// SALON TEMPLATES
// Palette: plum #3A2436, blush #EFE3DA, mocha #7A5C4C, champagne gold #C9A24B, rose #B98C86
// Type: font-playfair (display serif) + font-sans (body)
// ----------------------------------------------------------------------

const SalonPromoPink = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#EFE3DA] text-[#3A2436] ${getRatioClasses(aspect_ratio)} p-5 flex flex-col`}>
    <div className="bg-[#FBF7F3] flex-grow rounded-2xl p-7 flex flex-col shadow-[0_16px_40px_-16px_rgba(58,36,54,0.25)]">
      <div className="flex justify-between items-start mb-6">
        {content.logo_url && (
          <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-[#C9A24B]/50 object-cover" />
        )}
        <p className="text-[10px] tracking-[0.18em] text-[#7A5C4C] text-right ml-auto">{content.tagline}</p>
      </div>

      <h1 className="font-playfair text-4xl italic leading-[1.05] text-[#3A2436] mb-6">{content.headline}</h1>

      {content.image_url && (
        <div className="flex-grow rounded-xl overflow-hidden mb-6">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <p className="text-[11px] text-[#3A2436]/60 leading-relaxed mb-6">{content.details}</p>

      <button className="w-full bg-[#3A2436] text-[#EFE3DA] py-3.5 rounded-full font-medium text-sm tracking-wide">
        {content.cta}
      </button>
    </div>
    <Watermark />
  </div>
);

const SalonTreatmentSpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#3A2436] text-[#F3E9E4] ${getRatioClasses(aspect_ratio)} p-8 flex flex-col items-center text-center`}>
    <div className="absolute inset-4 border border-[#C9A24B]/30 pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center h-full w-full justify-between">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover mt-3 border border-[#C9A24B]/50" />
      )}

      <div>
        <p className="text-[10px] tracking-[0.2em] text-[#C9A24B] mb-3">{content.tagline}</p>
        <h1 className="font-playfair text-3xl leading-snug">{content.headline}</h1>
      </div>

      {content.image_url && (
        <div className="w-44 h-44 rounded-full overflow-hidden border border-[#C9A24B]/40">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div>
        <p className="text-[11px] font-light text-[#F3E9E4]/70 max-w-[85%] mx-auto mb-5 leading-relaxed">{content.details}</p>
        <span className="text-[11px] tracking-[0.15em] border-b border-[#C9A24B] text-[#C9A24B] pb-1">{content.cta}</span>
      </div>
    </div>
    <Watermark dark />
  </div>
);

const SalonGrandOpening = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#2B1A28] text-[#F3E9E4] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center`}>
    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent" />
    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent" />

    <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-full border border-[#C9A24B]/60 object-cover mb-5" />
      )}
      <p className="text-[#C9A24B] text-[11px] tracking-[0.18em] mb-3">{content.tagline}</p>
      <h1 className="font-playfair text-[2.3rem] leading-tight mb-6 max-w-[90%]">{content.headline}</h1>

      {content.image_url && (
        <div className="w-full h-40 rounded-sm overflow-hidden mb-6 border border-[#C9A24B]/25">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
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
    <div className="flex justify-between items-center mb-7">
      <span className="text-[10px] tracking-[0.16em] text-[#B98C86] font-medium">{content.tagline}</span>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full object-cover border border-[#B98C86]/40" />
      )}
    </div>

    <h1 className="font-playfair text-4xl leading-[1.08] mb-6">{content.headline}</h1>

    {content.image_url && (
      <div className="flex-grow rounded-2xl overflow-hidden mb-6 shadow-[0_18px_36px_-18px_rgba(58,36,54,0.3)]">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}

    <div className="border-t border-[#3A2436]/10 pt-5 flex items-end justify-between gap-4">
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
    <div className="flex justify-between items-start mb-6">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-white/25 object-cover" />
      )}
      <span className="bg-[#C9A24B] text-[#3A2436] text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-wide ml-auto">
        {content.tagline}
      </span>
    </div>

    <h1 className="font-playfair text-5xl leading-[0.95] mb-6">{content.headline}</h1>

    {content.image_url && (
      <div className="flex-grow rounded-xl overflow-hidden mb-6">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}

    <p className="text-[11px] font-light text-[#F3E9E4]/70 mb-5 leading-relaxed">{content.details}</p>

    <button className="w-full bg-[#F3E9E4] text-[#3A2436] font-semibold text-sm py-3.5 rounded-full">
      {content.cta}
    </button>
    <Watermark dark />
  </div>
);

const SalonHolidaySpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#3E1723] text-[#F3E7D8] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <div className="absolute inset-3 border border-[#C9A24B]/30 pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center text-center h-full">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-[#C9A24B]/60 object-cover mt-2 mb-5" />
      )}

      <h1 className="font-playfair italic text-4xl mb-2 text-[#C9A24B]">{content.headline}</h1>
      <p className="text-[10px] tracking-[0.2em] text-[#F3E7D8]/70 mb-6">{content.tagline}</p>

      {content.image_url && (
        <div className="flex-grow w-full rounded-sm overflow-hidden mb-6">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="w-8 h-px bg-[#C9A24B] mb-5" />
      <p className="text-[11px] font-light text-[#F3E7D8]/70 mb-6 px-4 leading-relaxed">{content.details}</p>
      <span className="bg-[#C9A24B] text-[#3E1723] px-7 py-2.5 rounded-full text-[11px] font-semibold tracking-wide">
        {content.cta}
      </span>
    </div>
    <Watermark dark />
  </div>
);

// ----------------------------------------------------------------------
// LOCAL SERVICES TEMPLATES
// Palette: navy #14213D, steel #3E5C76, slate #EDF1F5, signal #E0793C, white
// Type: font-inter (display sans) + font-sans (body)
// ----------------------------------------------------------------------

const ServicesHiringContractor = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#EDF1F5] text-[#14213D] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <div className="flex items-center justify-between mb-7">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-lg object-cover border border-[#14213D]/10" />
      )}
      <span className="text-[10px] font-semibold tracking-[0.14em] text-[#3E5C76] bg-white px-3 py-1.5 rounded-full border border-[#14213D]/10 ml-auto">
        {content.tagline}
      </span>
    </div>

    <h1 className="font-inter text-[2.5rem] font-bold leading-[0.95] tracking-tight mb-6">{content.headline}</h1>

    {content.image_url && (
      <div className="flex-grow relative mb-6 rounded-xl overflow-hidden">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}

    <div className="flex items-end justify-between gap-4 pt-4 border-t border-[#14213D]/10">
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
    <div className="flex justify-between items-start mb-7">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 bg-white rounded-lg p-1.5 object-cover" />
      )}
      <span className="text-[#E0793C] text-[10px] font-semibold tracking-[0.16em] ml-auto text-right">{content.tagline}</span>
    </div>

    <h1 className="font-inter text-[2.6rem] font-bold leading-[0.9] mb-6 max-w-[85%]">{content.headline}</h1>

    {content.image_url && (
      <div className="flex-grow rounded-xl overflow-hidden mb-6 border-l-2 border-[#E0793C]">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}

    <div className="flex items-end justify-between pt-5 border-t border-white/10">
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
    {content.logo_url && (
      <img src={content.logo_url} alt="logo" className="w-14 h-14 rounded-xl border border-[#14213D]/10 object-cover mt-5 mb-4" />
    )}

    <p className="text-[#3E5C76] font-semibold tracking-[0.14em] text-[10px] mb-2">{content.tagline}</p>
    <h1 className="font-inter text-[2.1rem] font-bold leading-tight mb-6 px-2">{content.headline}</h1>

    {content.image_url && (
      <div className="w-full flex-grow rounded-xl overflow-hidden mb-5 relative">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 w-full bg-[#14213D]/85 text-white text-[10px] font-semibold py-2 tracking-wide">
          Verified Professional
        </div>
      </div>
    )}

    <p className="text-[11px] text-[#14213D]/60 mb-5 px-2 leading-relaxed">{content.details}</p>

    <button className="w-full bg-[#14213D] text-white py-3.5 rounded-lg font-semibold text-[12px] mb-6">
      {content.cta}
    </button>
    <Watermark />
  </div>
);

const ServicesEventWorkspace = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1B2540] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <div className="flex justify-between items-center mb-6">
      <span className="bg-white/10 border border-white/15 text-white text-[10px] font-semibold px-4 py-1.5 rounded-full tracking-wide">
        {content.tagline}
      </span>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-white/25 object-cover" />
      )}
    </div>

    <h1 className="font-inter text-[2.4rem] font-bold leading-[1.05] mb-6">{content.headline}</h1>

    {content.image_url && (
      <div className="flex-grow rounded-xl overflow-hidden mb-6 relative">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1B2540]/15" />
      </div>
    )}

    <div className="flex items-center justify-between bg-white/8 p-4 rounded-xl border border-white/10 mt-auto">
      <p className="text-[11px] text-white/70 w-2/3 pr-4 border-r border-white/15 leading-relaxed">{content.details}</p>
      <span className="text-[#E0793C] font-semibold text-[12px] pl-4">{content.cta} &rarr;</span>
    </div>
    <Watermark dark />
  </div>
);

const ServicesDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#14213D] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <div className="flex justify-between items-start mb-6">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-lg bg-white p-1 object-cover" />
      )}
      <span className="text-[#E0793C] font-semibold text-[11px] tracking-wide border-b border-[#E0793C] pb-1 ml-auto">
        {content.tagline}
      </span>
    </div>

    <h1 className="font-inter text-[3.4rem] font-bold leading-[0.9] mb-6">{content.headline}</h1>

    {content.image_url && (
      <div className="flex-grow rounded-xl overflow-hidden mb-6 relative">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}

    <div className="mt-auto">
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
    <div className="flex justify-between items-center mb-6">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-white/25 object-cover" />
      )}
      <span className="bg-[#C4432B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-md flex items-center gap-1.5 ml-auto">
        <span className="w-1.5 h-1.5 bg-white rounded-full" /> {content.tagline}
      </span>
    </div>

    <h1 className="font-inter text-[2.3rem] font-bold leading-[1] mb-6">{content.headline}</h1>

    <div className="bg-white text-[#14213D] flex-grow p-5 rounded-xl shadow-lg flex flex-col">
      {content.image_url && (
        <div className="w-full h-36 rounded-lg overflow-hidden mb-4">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <p className="text-[12px] text-[#14213D]/70 leading-relaxed border-l-2 border-[#C4432B] pl-3 mb-auto">{content.details}</p>

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