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

// ----------------------------------------------------------------------
// RESTAURANT TEMPLATES
// ----------------------------------------------------------------------

const RestaurantPromoBold = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#F4F4F0] text-black ${getRatioClasses(aspect_ratio)} p-6 flex flex-col justify-between border-8 border-black`}>
    <div className="z-10 relative">
      <h1 className="text-5xl font-black font-sans uppercase leading-[0.9] tracking-tighter mb-3">{content.headline}</h1>
      <p className="text-lg font-bold text-gray-700 font-sans tracking-widest uppercase border-l-4 border-black pl-3">{content.tagline}</p>
    </div>
    {content.image_url && (
      <div className="my-4 flex-grow grid grid-cols-2 gap-2 max-h-[50%] relative z-10">
        <img src={content.image_url} alt="" className="w-full h-full object-cover rounded-tr-3xl rounded-bl-3xl grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl" />
        <div className="w-full h-full bg-black text-white rounded-tl-3xl rounded-br-3xl flex flex-col justify-center items-center p-4 text-center">
          <span className="text-xl font-bold uppercase">{content.cta}</span>
        </div>
      </div>
    )}
    <div className="flex justify-between items-end border-t-2 border-black pt-4 z-10">
      <p className="text-xs font-mono font-medium w-2/3 leading-tight">{content.details}</p>
      {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-full border-2 border-black object-cover bg-white" />}
    </div>
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-black/30 bg-white/30 px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const RestaurantMenuSpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-emerald-950 text-emerald-50 ${getRatioClasses(aspect_ratio)} p-8 flex flex-col items-center text-center justify-between`}>
    <div className="absolute inset-0 border-[12px] border-emerald-900 rounded-[3rem] pointer-events-none z-0"></div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/20 rounded-full blur-2xl"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-700/30 rounded-full blur-3xl"></div>
    
    <div className="z-10 mt-4">
      <h1 className="text-4xl font-playfair italic font-medium text-yellow-500 mb-2">{content.tagline}</h1>
      <h2 className="text-5xl font-black font-serif uppercase tracking-widest leading-none drop-shadow-lg">{content.headline}</h2>
    </div>
    
    {content.image_url && (
      <div className="w-48 h-48 rounded-t-full rounded-b-md overflow-hidden border-4 border-yellow-600/50 shadow-[0_0_30px_rgba(202,138,4,0.3)] z-10 my-4">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}
    
    <div className="z-10 flex flex-col items-center w-full">
      <div className="w-16 h-px bg-yellow-600/50 mb-4"></div>
      <p className="text-sm font-sans font-light tracking-wide mb-6">{content.details}</p>
      <div className="bg-yellow-600 text-emerald-950 px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg">{content.cta}</div>
    </div>
    
    {content.logo_url && <img src={content.logo_url} alt="logo" className="absolute top-6 left-6 w-12 h-12 rounded-full border border-yellow-600/50 object-cover bg-emerald-900 z-20" />}
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const RestaurantEventDinner = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-950 to-neutral-900 text-orange-50 ${getRatioClasses(aspect_ratio)} flex flex-col`}>
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-transparent z-0"></div>
    
    {content.image_url && (
      <div className="h-1/2 w-full relative z-10 [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)]">
        <img src={content.image_url} alt="" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/90 to-transparent"></div>
      </div>
    )}
    
    <div className={`p-6 flex-grow flex flex-col justify-end z-10 ${!content.image_url ? 'h-full justify-center' : ''}`}>
      <p className="text-orange-400 font-mono tracking-[0.2em] text-xs mb-2 uppercase">{content.tagline}</p>
      <h1 className="text-5xl font-fraunces font-bold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-500">{content.headline}</h1>
      <p className="text-sm font-sans font-light text-orange-100/80 mb-6 border-l-2 border-orange-500 pl-3">{content.details}</p>
      
      <div className="flex justify-between items-center w-full">
        <button className="border border-orange-500 text-orange-400 px-5 py-2 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-orange-950 transition-colors">
          {content.cta}
        </button>
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-full border-2 border-orange-900 object-cover" />}
      </div>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const RestaurantHiringChef = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-slate-900 text-white ${getRatioClasses(aspect_ratio)} p-8`}>
    <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <div className="w-16 h-2 bg-white mb-4"></div>
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-full border-2 border-white object-cover bg-slate-800" />}
      </div>
      
      <h1 className="text-6xl font-inter font-black uppercase tracking-tighter leading-none mb-2">{content.headline}</h1>
      <h2 className="text-xl font-poppins font-light text-cyan-400 tracking-widest uppercase mb-8">{content.tagline}</h2>
      
      {content.image_url && (
        <div className="flex-grow w-full mb-6 relative">
          <div className="absolute inset-2 border-2 border-white/20 z-20 pointer-events-none"></div>
          <img src={content.image_url} alt="" className="w-full h-full object-cover filter contrast-125" />
        </div>
      )}
      
      <div className="bg-white text-slate-900 p-4 -mx-8 -mb-8 mt-auto">
        <div className="flex justify-between items-center px-4">
          <p className="text-xs font-bold uppercase w-2/3 leading-tight">{content.details}</p>
          <div className="bg-slate-900 text-cyan-400 px-4 py-2 font-black uppercase text-sm tracking-wider">{content.cta}</div>
        </div>
      </div>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const RestaurantDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-red-600 text-white ${getRatioClasses(aspect_ratio)} flex flex-col items-center justify-center p-6 text-center`}>
    <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-yellow-400 rounded-full mix-blend-screen filter blur-2xl opacity-70 animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-80"></div>
    
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center border-4 border-dashed border-white/40 p-4">
      {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-full border-2 border-white object-cover bg-red-800 absolute top-4 left-4" />}
      
      <p className="text-yellow-300 font-black tracking-[0.3em] text-sm mb-4 uppercase drop-shadow-md">{content.tagline}</p>
      
      <div className="relative mb-6 w-full">
        <h1 className="text-6xl font-black font-sans uppercase tracking-tighter leading-none transform -skew-x-12 bg-white text-red-600 py-3 px-2 inline-block shadow-[8px_8px_0_rgba(253,224,71,1)]">{content.headline}</h1>
      </div>
      
      {content.image_url && (
        <div className="w-3/4 h-32 my-4 rounded-xl overflow-hidden border-2 border-yellow-300 shadow-xl transform rotate-2">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      
      <p className="text-sm font-bold bg-black text-white px-4 py-2 mt-4 mb-6 shadow-[4px_4px_0_rgba(253,224,71,1)] transform -rotate-1">{content.details}</p>
      
      <button className="bg-yellow-400 text-red-700 font-black text-xl uppercase px-8 py-3 rounded-full shadow-[0_10px_0_#991b1b] active:shadow-[0_0px_0_#991b1b] active:translate-y-2 transition-all">
        {content.cta}
      </button>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const RestaurantGrandOpening = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#FDFBF7] text-stone-900 ${getRatioClasses(aspect_ratio)} p-8 border-x-[16px] border-emerald-900 flex flex-col justify-between`}>
    <div className="absolute inset-0 border-y-2 border-emerald-900/20 m-2 pointer-events-none"></div>
    
    <div className="text-center z-10 flex flex-col items-center">
      {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-full border border-yellow-600 object-cover mb-4" />}
      <p className="text-xs font-serif text-yellow-700 uppercase tracking-[0.3em] mb-2">{content.tagline}</p>
      <h1 className="text-4xl font-playfair font-bold text-emerald-950 uppercase leading-snug">{content.headline}</h1>
      <div className="w-24 h-[1px] bg-yellow-600 my-4"></div>
    </div>
    
    {content.image_url && (
      <div className="w-full flex-grow my-4 rounded-t-full border-4 border-emerald-900 p-1">
        <img src={content.image_url} alt="" className="w-full h-full object-cover rounded-t-full" />
      </div>
    )}
    
    <div className="text-center z-10 pb-4">
      <p className="text-sm font-sans font-light text-stone-600 mb-4 px-4">{content.details}</p>
      <div className="inline-block bg-emerald-900 text-yellow-500 px-6 py-2 font-serif font-bold uppercase text-sm tracking-wider">
        {content.cta}
      </div>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-black/30 bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

// ----------------------------------------------------------------------
// SALON TEMPLATES
// ----------------------------------------------------------------------

const SalonPromoPink = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#E2C7B8] text-stone-900 ${getRatioClasses(aspect_ratio)} flex flex-col justify-between`}>
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8a5a44_1px,transparent_1px)] [background-size:16px_16px] z-0"></div>
    
    <div className="bg-[#FAF6F0] p-6 m-4 flex-grow rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative z-10 flex flex-col border-b-[8px] border-dotted border-[#c89f89]">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-4xl font-serif italic text-[#8a5a44] leading-tight w-2/3">{content.headline}</h1>
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-full border border-[#8a5a44] object-cover" />}
      </div>
      
      {content.image_url && (
        <div className="w-32 h-32 self-center rounded-full border-4 border-[#E2C7B8] shadow-lg overflow-hidden mb-6 flex-shrink-0">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      
      <p className="text-sm font-bold uppercase tracking-widest text-[#8a5a44] mb-2">{content.tagline}</p>
      <div className="w-12 h-[2px] bg-[#8a5a44] mb-4"></div>
      <p className="text-xs font-sans text-stone-600 mb-auto leading-relaxed">{content.details}</p>
      
      <button className="w-full bg-[#8a5a44] text-[#FAF6F0] py-3 mt-4 font-serif italic text-lg shadow-md">
        {content.cta}
      </button>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-black/30 bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const SalonTreatmentSpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-rose-50 text-stone-800 ${getRatioClasses(aspect_ratio)} p-4`}>
    <div className="w-full h-full border-[1px] border-yellow-600/50 p-4 flex flex-col items-center justify-between text-center relative z-10">
      <div className="w-full h-full border-[1px] border-yellow-600/30 p-6 flex flex-col items-center justify-between">
        
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover mb-4 grayscale" />}
        
        <div className="mb-4">
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-yellow-700 mb-2">{content.tagline}</p>
          <h1 className="text-3xl font-playfair text-stone-900 leading-snug">{content.headline}</h1>
        </div>

        {content.image_url && (
          <div className="w-full h-40 overflow-hidden my-4">
            <img src={content.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <p className="text-xs font-sans font-light text-stone-500 max-w-[80%] mb-4">{content.details}</p>
        
        <div className="text-xs font-sans uppercase tracking-widest border-b border-stone-800 pb-1 mt-auto">
          {content.cta}
        </div>
      </div>
    </div>
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-black/30 bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const SalonGrandOpening = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-emerald-950 text-white ${getRatioClasses(aspect_ratio)} p-8 flex flex-col items-center text-center justify-between`}>
    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:10px_10px] z-0"></div>
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-700"></div>
    <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-700"></div>
    
    <div className="relative z-10 flex flex-col items-center w-full h-full">
      {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-full border border-yellow-400/50 object-cover mb-6" />}
      
      <p className="text-yellow-400/80 font-serif italic text-lg mb-2">{content.tagline}</p>
      <h1 className="text-4xl font-playfair uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 font-black leading-tight drop-shadow-sm mb-6">{content.headline}</h1>
      
      {content.image_url && (
        <div className="w-full flex-grow relative border-2 border-yellow-500/30 p-2 mb-6">
          <div className="absolute inset-0 bg-yellow-500/10 z-20 pointer-events-none"></div>
          <img src={content.image_url} alt="" className="w-full h-full object-cover filter contrast-125 sepia-[0.3]" />
        </div>
      )}
      
      <p className="text-xs font-sans text-stone-300 tracking-wide mb-6 px-4">{content.details}</p>
      
      <button className="bg-transparent border border-yellow-500 text-yellow-400 px-8 py-2 font-serif uppercase tracking-widest text-xs hover:bg-yellow-500 hover:text-emerald-950 transition-colors">
        {content.cta}
      </button>
    </div>
    
    <div className='absolute bottom-3 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const SalonHiringStylist = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-pink-50 text-pink-950 ${getRatioClasses(aspect_ratio)} p-8 flex flex-col`}>
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 z-0"></div>
    <div className="absolute top-1/2 -left-20 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 z-0"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm font-sans uppercase tracking-[0.2em] text-pink-700">{content.tagline}</h2>
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover shadow-sm" />}
      </div>
      
      <h1 className="text-5xl font-playfair font-medium leading-[1.1] mb-6">{content.headline}</h1>
      
      {content.image_url && (
        <div className="flex-grow w-full relative mb-6">
          <div className="absolute inset-0 bg-pink-100 rounded-tl-[4rem] rounded-br-[4rem] transform translate-x-2 translate-y-2"></div>
          <img src={content.image_url} alt="" className="w-full h-full object-cover rounded-tl-[4rem] rounded-br-[4rem] relative z-10 shadow-lg" />
        </div>
      )}
      
      <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl border border-pink-100 mb-4 shadow-sm">
        <p className="text-xs font-sans text-pink-800 leading-relaxed">{content.details}</p>
      </div>
      
      <button className="w-full bg-pink-800 text-white py-3 rounded-full font-sans uppercase tracking-widest text-xs font-bold shadow-md hover:bg-pink-900 transition-colors mt-auto">
        {content.cta}
      </button>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-black/30 bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const SalonDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-gradient-to-tr from-fuchsia-600 to-purple-800 text-white ${getRatioClasses(aspect_ratio)} p-8 flex flex-col items-center justify-center text-center`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-400/40 via-transparent to-transparent"></div>
    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-900/80 to-transparent pointer-events-none"></div>
    
    <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
      <div className="w-full flex justify-between items-start">
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" />}
        <span className="bg-white text-purple-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">{content.tagline}</span>
      </div>
      
      <div className="my-auto flex flex-col items-center">
        <h1 className="text-6xl font-black font-sans uppercase leading-none drop-shadow-2xl transform -rotate-2 mb-4">{content.headline}</h1>
        
        {content.image_url && (
          <div className="w-48 h-48 rounded-full border-4 border-fuchsia-300 overflow-hidden shadow-2xl my-4">
            <img src={content.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      
      <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-4">
        <p className="text-sm font-medium text-fuchsia-100">{content.details}</p>
      </div>
      
      <button className="bg-gradient-to-r from-pink-300 to-fuchsia-400 text-purple-950 font-black text-lg uppercase px-10 py-3 rounded-full shadow-[0_0_20px_rgba(232,121,249,0.5)] w-full">
        {content.cta}
      </button>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const SalonHolidaySpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-rose-950 text-rose-50 ${getRatioClasses(aspect_ratio)} p-6 border-4 border-rose-900 flex flex-col`}>
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDIxNSwwLDAuMSkiLz48L3N2Zz4=')] opacity-50 z-0"></div>
    
    <div className="relative z-10 border border-yellow-600/30 p-6 flex flex-col h-full items-center text-center">
      {content.logo_url && <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-yellow-600 object-cover mb-4" />}
      
      <h1 className="text-4xl font-playfair italic font-medium text-yellow-500 mb-2 drop-shadow-md">{content.headline}</h1>
      <p className="text-xs font-sans uppercase tracking-[0.3em] text-rose-200 mb-6">{content.tagline}</p>
      
      {content.image_url && (
        <div className="flex-grow w-full relative my-2 p-1 border border-yellow-600/20">
          <img src={content.image_url} alt="" className="w-full h-full object-cover opacity-90" />
        </div>
      )}
      
      <div className="mt-6 flex flex-col items-center">
        <div className="w-8 h-[1px] bg-yellow-500 mb-4"></div>
        <p className="text-xs font-sans text-rose-200/80 mb-6 px-4">{content.details}</p>
        <button className="bg-yellow-600 text-rose-950 px-8 py-2 font-serif uppercase tracking-widest text-xs font-bold shadow-lg">
          {content.cta}
        </button>
      </div>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

// ----------------------------------------------------------------------
// LOCAL SERVICES TEMPLATES
// ----------------------------------------------------------------------

const ServicesHiringContractor = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-white text-slate-800 ${getRatioClasses(aspect_ratio)} p-8 flex flex-col`}>
    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-bl-full z-0 opacity-10"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-tr-full z-0 opacity-10"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 border-b-2 border-emerald-500 pb-4">
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 object-cover rounded-md" />}
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{content.tagline}</span>
      </div>
      
      <h1 className="text-5xl font-sans font-black uppercase leading-none mb-6 text-slate-900">{content.headline}</h1>
      
      {content.image_url && (
        <div className="w-full flex-grow relative mb-6">
          <div className="absolute inset-0 bg-emerald-500 transform translate-x-3 translate-y-3 rounded-xl z-0"></div>
          <img src={content.image_url} alt="" className="w-full h-full object-cover relative z-10 rounded-xl border-2 border-slate-900" />
        </div>
      )}
      
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
        <p className="text-sm font-medium text-slate-600">{content.details}</p>
      </div>
      
      <button className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-lg hover:bg-emerald-600 transition-colors shadow-[0_4px_0_rgb(4,120,87)] active:shadow-none active:translate-y-1">
        {content.cta}
      </button>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-black/30 bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const ServicesPromoTerracotta = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1A1F2B] text-white ${getRatioClasses(aspect_ratio)} flex flex-col`}>
    <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600 transform skew-x-12 translate-x-10 z-0"></div>
    
    <div className="relative z-10 p-8 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-14 h-14 bg-white p-1 rounded-lg object-cover" />}
        <div className="text-right">
          <span className="text-blue-400 font-mono text-xs uppercase tracking-widest block">{content.tagline}</span>
        </div>
      </div>
      
      <h1 className="text-5xl font-sans font-black uppercase leading-[0.85] text-white mb-6 max-w-[80%]">{content.headline}</h1>
      
      {content.image_url && (
        <div className="flex-grow w-full border-l-4 border-blue-500 pl-4 mb-6 relative">
          <img src={content.image_url} alt="" className="w-full h-full object-cover shadow-2xl filter contrast-125" />
        </div>
      )}
      
      <div className="mt-auto flex justify-between items-end">
        <p className="text-xs font-sans text-gray-300 w-2/3 leading-relaxed border-t border-gray-700 pt-4">{content.details}</p>
        <button className="bg-blue-600 text-white px-6 py-3 font-bold uppercase text-xs tracking-wider hover:bg-blue-700 transition-colors ml-4">
          {content.cta}
        </button>
      </div>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const ServicesGuaranteedTrust = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-sky-50 text-sky-950 ${getRatioClasses(aspect_ratio)} p-8 border-t-8 border-blue-700 flex flex-col items-center text-center`}>
    <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-blue-100 to-transparent opacity-50 z-0"></div>
    
    <div className="relative z-10 flex flex-col h-full w-full items-center">
      {content.logo_url && <img src={content.logo_url} alt="logo" className="w-16 h-16 rounded-2xl bg-white shadow-md p-2 object-cover mb-4" />}
      
      <p className="text-blue-700 font-bold tracking-widest text-xs uppercase mb-2">{content.tagline}</p>
      <h1 className="text-4xl font-sans font-black text-sky-950 leading-tight mb-6">{content.headline}</h1>
      
      {content.image_url && (
        <div className="w-full flex-grow rounded-2xl overflow-hidden shadow-lg border-4 border-white mb-6 relative">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 w-full bg-blue-700 text-white text-xs font-bold py-2 uppercase">Verified Professional</div>
        </div>
      )}
      
      <div className="bg-white w-full p-4 rounded-xl shadow-sm mb-4 border border-sky-100">
        <p className="text-sm text-sky-800">{content.details}</p>
      </div>
      
      <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold uppercase tracking-wider text-sm shadow-md">
        {content.cta}
      </button>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-black/30 bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const ServicesEventWorkspace = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 text-white ${getRatioClasses(aspect_ratio)} p-8 flex flex-col`}>
    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 z-0"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 z-0"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <span className="bg-yellow-400 text-purple-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">{content.tagline}</span>
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border-2 border-white/50 object-cover" />}
      </div>
      
      <h1 className="text-5xl font-inter font-black uppercase leading-[1.1] mb-6 drop-shadow-lg">{content.headline}</h1>
      
      {content.image_url && (
        <div className="flex-grow w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative mb-6">
          <div className="absolute inset-0 bg-purple-900/20 mix-blend-multiply z-10"></div>
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 mt-auto">
        <p className="text-xs font-medium text-purple-100 w-2/3 pr-4 border-r border-white/20">{content.details}</p>
        <button className="text-yellow-400 font-bold uppercase text-sm tracking-wider pl-4 hover:text-yellow-300">
          {content.cta} &rarr;
        </button>
      </div>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const ServicesDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-blue-600 text-white ${getRatioClasses(aspect_ratio)} flex flex-col p-6`}>
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-lg transform rotate-45 z-0"></div>
    <div className="absolute top-40 -left-20 w-40 h-40 bg-blue-700 rounded-lg transform rotate-12 z-0"></div>
    <div className="absolute bottom-10 right-10 w-20 h-20 bg-yellow-400 rounded-full z-0 opacity-90 shadow-lg"></div>
    
    <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/30 h-full flex flex-col shadow-xl">
      <div className="flex justify-between items-start mb-4">
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-xl object-cover bg-white p-1 shadow-sm" />}
        <span className="text-yellow-300 font-bold uppercase tracking-widest text-sm border-b-2 border-yellow-300 pb-1">{content.tagline}</span>
      </div>
      
      <h1 className="text-6xl font-black font-sans uppercase leading-none drop-shadow-md mb-6">{content.headline}</h1>
      
      {content.image_url && (
        <div className="w-full flex-grow rounded-xl overflow-hidden shadow-inner mb-6 relative">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
        </div>
      )}
      
      <div className="mt-auto">
        <p className="text-sm font-medium mb-4 bg-blue-900/50 p-3 rounded-lg border border-blue-500/50">{content.details}</p>
        <button className="w-full bg-yellow-400 text-blue-900 py-3 rounded-xl font-black uppercase text-lg shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:shadow-[0_6px_20px_rgba(250,204,21,0.23)] hover:bg-yellow-300 transition-all">
          {content.cta}
        </button>
      </div>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
  </div>
);

const ServicesEmergency247 = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#e5dfd3] text-stone-900 ${getRatioClasses(aspect_ratio)} p-6 flex flex-col`}>
    <div className="absolute top-0 w-full h-32 bg-stone-900 z-0 left-0"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 text-white">
        {content.logo_url && <img src={content.logo_url} alt="logo" className="w-12 h-12 rounded-full border-2 border-[#e5dfd3] object-cover" />}
        <span className="bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm flex items-center gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> {content.tagline}
        </span>
      </div>
      
      <h1 className="text-4xl font-black font-sans uppercase leading-tight text-white mb-8">{content.headline}</h1>
      
      <div className="bg-white flex-grow p-5 rounded-xl shadow-xl flex flex-col mb-4 border border-stone-200">
        {content.image_url && (
          <div className="w-full h-40 rounded-lg overflow-hidden mb-4 shadow-sm">
            <img src={content.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="flex text-yellow-400 text-xl mb-2">★★★★★</div>
        <p className="text-sm font-medium text-stone-600 italic border-l-4 border-stone-300 pl-3 mb-auto">"{content.details}"</p>
        
        <button className="w-full bg-stone-900 text-white py-3 mt-4 rounded-lg font-bold uppercase tracking-widest text-sm shadow-md hover:bg-stone-800 transition-colors">
          {content.cta}
        </button>
      </div>
    </div>
    
    <div className='absolute bottom-2 right-3 text-[7px] font-mono tracking-widest text-black/30 bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded uppercase select-none pointer-events-none z-30'>Designed by DevFrames</div>
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
