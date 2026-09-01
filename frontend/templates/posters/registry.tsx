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

/* ============================================================================================
   DESIGN SYSTEM
   ------------------------------------------------------------------------------------------
   Every poster below is assembled from this shared kit — the same way a real template studio
   (Canva, Adobe Express) builds a "brand kit" once and skins it per-category. Nothing here is
   template-specific: icons, textures, ribbons, badges, dividers, frames are all reusable, so
   the 18 posters read as one considered product family instead of 18 unrelated experiments.

   Groups:
   1. Iconography      — IconGlyph, a tiny hand-drawn line-icon set (no external icon package)
   2. Texture layers    — Grain, LightWash, DotGrid, HalftoneDots, DiagonalStripes
   3. Structural frames — CornerMarks, OrnamentRule, BrushUnderline, WaveDivider
   4. Motion / energy   — SunburstRays, ConfettiScatter
   5. Badges & panels   — Eyebrow, Stars, MedallionBadge, FoldedRibbon, SealStamp, TicketStub,
                           GlassPanel, PullQuoteMark, FramedImage
   6. Chrome            — FooterMeta, Watermark
=============================================================================================== */

/* ---------------------------------- 1. ICONOGRAPHY ------------------------------------------ */

type IconName =
  | 'fork' | 'wine' | 'flame' | 'leaf'
  | 'scissors' | 'sparkle' | 'comb' | 'drop'
  | 'wrench' | 'shield' | 'phone' | 'clock' | 'calendar' | 'hardhat'
  | 'arrowRight' | 'star' | 'check' | 'bolt';

const IconGlyph: React.FC<{ name: IconName; size?: number; color: string; strokeWidth?: number; className?: string }> = ({
  name, size = 18, color, strokeWidth = 1.6, className = '',
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };
  switch (name) {
    case 'fork':
      return (
        <svg {...common}>
          <line x1="6" y1="2" x2="6" y2="9" />
          <line x1="9" y1="2" x2="9" y2="9" />
          <path d="M6 9c0 1.6 1.3 2.5 1.5 3.5V22" />
          <line x1="17" y1="2" x2="17" y2="14" />
          <path d="M15 2v6c0 1.5 1 2 2 2s2-.5 2-2V2" />
        </svg>
      );
    case 'wine':
      return (
        <svg {...common}>
          <path d="M8 3h8l-1 6a3 3 0 0 1-6 0L8 3z" />
          <line x1="12" y1="14" x2="12" y2="21" />
          <line x1="8.5" y1="21" x2="15.5" y2="21" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 2c2 3-1 4-1 7a3 3 0 0 0 6 0c1.5 2 1 5-1 7a6 6 0 0 1-10-4c0-4 3-6 6-10z" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M20 4C10 4 4 10 4 18c8 0 14-6 16-14z" />
          <path d="M7 18c3-5 6-8 12-13" />
        </svg>
      );
    case 'scissors':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <line x1="20" y1="4" x2="8.5" y2="15.5" />
          <line x1="8.5" y1="8.5" x2="20" y2="20" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common}>
          <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
        </svg>
      );
    case 'comb':
      return (
        <svg {...common}>
          <path d="M4 4h16v4H4z" />
          {[5, 8, 11, 14, 17, 19.5].map((x) => (
            <line key={x} x1={x} y1="8" x2={x} y2="20" />
          ))}
        </svg>
      );
    case 'drop':
      return (
        <svg {...common}>
          <path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" />
        </svg>
      );
    case 'wrench':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
          <path d="M8.5 12l2.3 2.3L16 9.5" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M6 3h4l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L21 14v4a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2z" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
          <line x1="3.5" y1="10" x2="20.5" y2="10" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
        </svg>
      );
    case 'hardhat':
      return (
        <svg {...common}>
          <path d="M4 16a8 8 0 0 1 16 0z" />
          <line x1="2" y1="16" x2="22" y2="16" />
          <line x1="12" y1="5" x2="12" y2="8" />
        </svg>
      );
    case 'arrowRight':
      return (
        <svg {...common}>
          <line x1="4" y1="12" x2="19" y2="12" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common} fill={color} stroke="none">
          <path d="M12 2l2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7-5.4-4.7 7.1-.7z" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M4 12.5l5 5L20 6" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common} fill={color} stroke="none">
          <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
        </svg>
      );
    default:
      return null;
  }
};

/* ------------------------------- 2. TEXTURE LAYERS ------------------------------------------- */

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

const LightWash: React.FC<{ color: string; x?: string; y?: string; size?: number; opacity?: number }> = ({
  color, x = '80%', y = '0%', size = 60, opacity = 0.35,
}) => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{ background: `radial-gradient(${size}% ${size}% at ${x} ${y}, ${color} 0%, transparent 70%)`, opacity }}
  />
);

const DotGrid: React.FC<{ color: string; opacity?: number; size?: number }> = ({ color, opacity = 0.5, size = 18 }) => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{ opacity, backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: `${size}px ${size}px` }}
  />
);

const HalftoneDots: React.FC<{ color: string; opacity?: number; corner?: 'tl' | 'tr' | 'bl' | 'br' }> = ({
  color, opacity = 0.5, corner = 'br',
}) => {
  const pos: Record<string, string> = {
    tl: 'top-0 left-0', tr: 'top-0 right-0', bl: 'bottom-0 left-0', br: 'bottom-0 right-0',
  };
  return (
    <div
      className={`absolute ${pos[corner]} w-40 h-40 pointer-events-none z-0`}
      style={{
        opacity,
        backgroundImage: `radial-gradient(${color} 1.6px, transparent 1.6px)`,
        backgroundSize: '9px 9px',
        maskImage: `radial-gradient(circle at ${corner.includes('r') ? '100%' : '0%'} ${corner.includes('b') ? '100%' : '0%'}, black 0%, transparent 75%)`,
        WebkitMaskImage: `radial-gradient(circle at ${corner.includes('r') ? '100%' : '0%'} ${corner.includes('b') ? '100%' : '0%'}, black 0%, transparent 75%)`,
      }}
    />
  );
};

const DiagonalStripes: React.FC<{ color: string; opacity?: number }> = ({ color, opacity = 0.06 }) => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{
      opacity,
      backgroundImage: `repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent 10px)`,
    }}
  />
);

/* ------------------------------ 3. STRUCTURAL FRAMES ----------------------------------------- */

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

const OrnamentRule: React.FC<{ color: string; className?: string }> = ({ color, className = '' }) => (
  <div className={`flex items-center justify-center gap-2 ${className}`}>
    <span className="h-px w-8" style={{ background: color, opacity: 0.6 }} />
    <span className="w-1.5 h-1.5 rotate-45" style={{ background: color }} />
    <span className="h-px w-8" style={{ background: color, opacity: 0.6 }} />
  </div>
);

/** A loose hand-drawn underline stroke beneath a headline word/line — the "highlighter swipe" look. */
const BrushUnderline: React.FC<{ color: string; width?: number; className?: string }> = ({ color, width = 160, className = '' }) => (
  <svg width={width} height="14" viewBox="0 0 160 14" fill="none" className={className}>
    <path d="M2 9.5C34 3 90 3.5 158 8" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
  </svg>
);

/** A full-width wave, used to stitch an image band into a color panel — a signature "template" seam. */
const WaveDivider: React.FC<{ color: string; flip?: boolean }> = ({ color, flip }) => (
  <svg
    viewBox="0 0 400 40"
    preserveAspectRatio="none"
    className={`absolute left-0 w-full h-8 z-10 ${flip ? 'top-0 rotate-180' : 'bottom-0'}`}
    style={{ transform: flip ? 'translateY(-1px) rotate(180deg)' : 'translateY(1px)' }}
  >
    <path d="M0 20C60 40 100 0 160 12C220 24 260 0 320 10C360 17 380 22 400 18V40H0V20Z" fill={color} />
  </svg>
);

/* -------------------------------- 4. MOTION / ENERGY ----------------------------------------- */

const SunburstRays: React.FC<{ color: string; count?: number; opacity?: number; size?: number }> = ({
  color, count = 16, opacity = 0.35, size = 260,
}) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <div className="relative" style={{ width: size, height: size }}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute top-1/2 left-1/2 origin-left"
          style={{
            width: size / 2, height: 2, background: color, opacity,
            transform: `rotate(${(360 / count) * i}deg)`,
          }}
        />
      ))}
    </div>
  </div>
);

const CONFETTI_SHAPES = [
  { top: '8%', left: '12%', rot: 12, shape: 'circle', size: 8 },
  { top: '15%', left: '85%', rot: -20, shape: 'rect', size: 7 },
  { top: '78%', left: '10%', rot: 30, shape: 'rect', size: 6 },
  { top: '85%', left: '80%', rot: -10, shape: 'circle', size: 6 },
  { top: '5%', left: '55%', rot: 45, shape: 'tri', size: 9 },
  { top: '92%', left: '48%', rot: -35, shape: 'circle', size: 5 },
];

const ConfettiScatter: React.FC<{ colors: string[] }> = ({ colors }) => (
  <div className="absolute inset-0 pointer-events-none z-10">
    {CONFETTI_SHAPES.map((c, i) => {
      const color = colors[i % colors.length];
      const style: React.CSSProperties = {
        position: 'absolute', top: c.top, left: c.left, transform: `rotate(${c.rot}deg)`,
        width: c.size, height: c.size,
      };
      if (c.shape === 'circle') return <span key={i} style={{ ...style, borderRadius: '50%', background: color }} />;
      if (c.shape === 'tri') {
        return (
          <span
            key={i}
            style={{
              ...style, width: 0, height: 0,
              borderLeft: `${c.size / 2}px solid transparent`,
              borderRight: `${c.size / 2}px solid transparent`,
              borderBottom: `${c.size}px solid ${color}`,
            }}
          />
        );
      }
      return <span key={i} style={{ ...style, background: color, borderRadius: 2 }} />;
    })}
  </div>
);

/* -------------------------------- 5. BADGES & PANELS ------------------------------------------ */

const Eyebrow: React.FC<{ children: React.ReactNode; className?: string; dot?: string; icon?: IconName }> = ({
  children, className = '', dot, icon,
}) => (
  <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase ${className}`}>
    {icon && <IconGlyph name={icon} size={11} color="currentColor" strokeWidth={2} />}
    {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />}
    {children}
  </span>
);

const Stars: React.FC<{ color?: string; size?: string }> = ({ color = '#C9A24B', size = 'text-sm' }) => (
  <div className={`flex gap-0.5 ${size}`} style={{ color, lineHeight: 1 }}>
    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
  </div>
);

/** A large circular badge for percentage-off / headline callouts, ringed and lightly beveled. */
const MedallionBadge: React.FC<{ text: string; bg: string; fg: string; ring: string; size?: number }> = ({
  text, bg, fg, ring, size = 130,
}) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    <div className="absolute inset-0 rounded-full" style={{ border: `1px dashed ${ring}`, transform: 'scale(1.16)' }} />
    <div
      className="w-full h-full rounded-full flex items-center justify-center text-center px-3 shadow-lg"
      style={{ background: bg, color: fg, boxShadow: `0 14px 30px -10px ${bg}99` }}
    >
      <span className="font-fraunces font-semibold leading-[1.05]" style={{ fontSize: size * 0.185 }}>{text}</span>
    </div>
  </div>
);

/** A folded-corner ribbon banner, angled across a poster corner. */
const FoldedRibbon: React.FC<{ text: string; bg: string; fg: string; corner?: 'tl' | 'tr' }> = ({
  text, bg, fg, corner = 'tr',
}) => (
  <div
    className="absolute z-30 overflow-hidden pointer-events-none"
    style={corner === 'tr' ? { top: 18, right: -54, width: 200 } : { top: 18, left: -54, width: 200 }}
  >
    <div
      className="text-center py-1.5 text-[10px] font-bold tracking-[0.12em] uppercase shadow-md"
      style={{ background: bg, color: fg, transform: `rotate(${corner === 'tr' ? 45 : -45}deg)` }}
    >
      {text}
    </div>
  </div>
);

/** A round certification-style stamp — dashed ring, small star, curved caption. */
const SealStamp: React.FC<{ label: string; color: string; size?: number }> = ({ label, color, size = 64 }) => (
  <div
    className="rounded-full flex flex-col items-center justify-center text-center shrink-0"
    style={{ width: size, height: size, border: `1.5px dashed ${color}` }}
  >
    <IconGlyph name="star" size={size * 0.22} color={color} />
    <span className="text-[7px] font-bold tracking-[0.1em] uppercase mt-0.5" style={{ color }}>{label}</span>
  </div>
);

/** Wraps a card with punched semicircle notches on both edges + a dashed tear-line, like a coupon. */
const TicketStub: React.FC<{ pageColor: string; className?: string; children: React.ReactNode }> = ({
  pageColor, className = '', children,
}) => (
  <div className={`relative ${className}`}>
    <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full z-20" style={{ background: pageColor }} />
    <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full z-20" style={{ background: pageColor }} />
    {children}
  </div>
);

const GlassPanel: React.FC<{ className?: string; children: React.ReactNode; border?: string }> = ({
  className = '', children, border = 'rgba(255,255,255,0.18)',
}) => (
  <div className={`backdrop-blur-md bg-white/10 rounded-xl ${className}`} style={{ border: `1px solid ${border}` }}>
    {children}
  </div>
);

const PullQuoteMark: React.FC<{ color: string; size?: number; className?: string }> = ({ color, size = 46, className = '' }) => (
  <span
    className={`font-fraunces leading-none select-none ${className}`}
    style={{ color, fontSize: size, opacity: 0.25 }}
  >
    &ldquo;
  </span>
);

const FramedImage: React.FC<{ src: string; frameColor: string; radius?: string; ratio?: string; children?: React.ReactNode; duotone?: string }> = ({
  src, frameColor, radius = 'rounded-lg', ratio = '', children, duotone,
}) => (
  <div className={`relative ${ratio}`}>
    <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 ${radius}`} style={{ border: `1px solid ${frameColor}`, opacity: 0.5 }} />
    <div className={`relative w-full h-full overflow-hidden ${radius}`}>
      <img src={src} alt="" className="w-full h-full object-cover" />
      {duotone && <div className="absolute inset-0" style={{ background: duotone, mixBlendMode: 'color' }} />}
      {children}
    </div>
  </div>
);

/* ------------------------------------- 6. CHROME ---------------------------------------------- */

const FooterMeta: React.FC<{ logo?: string; textColor: string; ringColor: string; label?: string }> = ({ logo, textColor, ringColor, label }) => (
  <div className="flex items-center gap-2">
    {logo && <img src={logo} alt="logo" className="w-8 h-8 rounded-full object-cover" style={{ border: `1px solid ${ringColor}` }} />}
    {label && <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: textColor }}>{label}</span>}
  </div>
);

const Watermark: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div className={`absolute bottom-3 right-3 text-[7px] font-medium tracking-[0.15em] ${dark ? 'text-white/45' : 'text-black/30'} uppercase select-none pointer-events-none z-30`}>
    Designed by DevFrames
  </div>
);

/* ---------------------------- 7. COMPOSITION HELPERS ------------------------------------------
   A second layer of primitives, built on top of groups 1–6, that give individual templates more
   to compose with: small credibility chips, a folded price tag, concentric accent rings behind a
   badge, and a two-column split wrapper for "editorial" layouts. These are what make a poster
   look art-directed rather than "text on a colored rectangle."
=============================================================================================== */

/** A single pill combining an icon + short label — used in rows of 2–3 as quiet credibility signals. */
const MetaChip: React.FC<{ icon: IconName; label: string; color: string; bg?: string; border?: string }> = ({
  icon, label, color, bg = 'transparent', border,
}) => (
  <span
    className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.06em] px-2.5 py-1.5 rounded-full"
    style={{ color, background: bg, border: border ? `1px solid ${border}` : undefined }}
  >
    <IconGlyph name={icon} size={11} color={color} strokeWidth={1.8} />
    {label}
  </span>
);

/** A horizontal row of MetaChips — the small "amenities strip" seen under a lot of print collateral. */
const MetaRow: React.FC<{ items: { icon: IconName; label: string }[]; color: string; bg?: string; border?: string; className?: string }> = ({
  items, color, bg, border, className = '',
}) => (
  <div className={`flex flex-wrap items-center gap-2 ${className}`}>
    {items.map((it, i) => (
      <MetaChip key={i} icon={it.icon} label={it.label} color={color} bg={bg} border={border} />
    ))}
  </div>
);

/** A folded price/label tag — a rectangle with a notched point on one side, like a string-tag on a gift. */
const PriceTag: React.FC<{ text: string; bg: string; fg: string; className?: string }> = ({ text, bg, fg, className = '' }) => (
  <div
    className={`inline-flex items-center h-8 pl-4 pr-3 text-[11px] font-bold tracking-wide ${className}`}
    style={{
      background: bg,
      color: fg,
      clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)',
    }}
  >
    {text}
    <span className="w-1.5 h-1.5 rounded-full ml-2" style={{ background: fg, opacity: 0.5 }} />
  </div>
);

/** Two or three concentric rings behind a focal element (a badge, a portrait) for visual gravity. */
const AccentRings: React.FC<{ color: string; size?: number }> = ({ color, size = 220 }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <span className="rounded-full absolute" style={{ width: size, height: size, border: `1px solid ${color}`, opacity: 0.18 }} />
    <span className="rounded-full absolute" style={{ width: size * 0.72, height: size * 0.72, border: `1px solid ${color}`, opacity: 0.28 }} />
  </div>
);

/** A soft irregular color field (two overlapping blurred blobs) used behind hero copy for depth. */
const AccentBlobField: React.FC<{ colorA: string; colorB: string }> = ({ colorA, colorB }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <span className="absolute rounded-full blur-3xl" style={{ width: 220, height: 220, top: '-10%', right: '-15%', background: colorA, opacity: 0.35 }} />
    <span className="absolute rounded-full blur-3xl" style={{ width: 180, height: 180, bottom: '-12%', left: '-10%', background: colorB, opacity: 0.3 }} />
  </div>
);

/** Two-column layout wrapper: a fixed-width side rail plus a flexible content column. Used for
 *  "editorial" compositions where a photo or index rail sits beside the copy rather than above it. */
const SplitPanel: React.FC<{ rail: React.ReactNode; railWidth?: string; className?: string; children: React.ReactNode }> = ({
  rail, railWidth = '34%', className = '', children,
}) => (
  <div className={`flex w-full h-full ${className}`}>
    <div style={{ width: railWidth }} className="shrink-0 relative">{rail}</div>
    <div className="flex-grow relative">{children}</div>
  </div>
);

/* ============================================================================================
   RESTAURANT TEMPLATES
   Tokens — ink #1C1B19 · ivory #F6F1E9 · clay #B5563C · wine #5C1F2E · olive #656B45 · gold #C9A24B
   Type   — display: font-fraunces (serif)  ·  body: font-sans  ·  meta: font-mono
=============================================================================================== */

/** Editorial promo card: ivory ground, halftone corner texture, brush-stroke underline
   under the headline, and a framed hero shot with the CTA pinned inside it as a pill. */
const RestaurantPromoBold = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#F6F1E9] text-[#1C1B19] ${getRatioClasses(aspect_ratio)} flex flex-col`}>
    <LightWash color="#B5563C" x="90%" y="-10%" opacity={0.14} />
    <DotGrid color="#1C1B19" opacity={0.05} />
    <HalftoneDots color="#B5563C" opacity={0.4} corner="br" />
    <Grain opacity={0.04} />
    <CornerMarks color="#1C1B19" inset={12} />

    <div className="relative z-10 px-8 pt-8 pb-2 flex items-start justify-between">
      <Eyebrow className="text-[#B5563C]" dot="#B5563C">{content.tagline}</Eyebrow>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-full object-cover border border-[#1C1B19]/15 shadow-sm" />
      )}
    </div>

    <div className="relative z-10 px-8 mt-3">
      <h1 className="font-fraunces text-[2.5rem] font-medium leading-[0.94] tracking-tight">{content.headline}</h1>
      <BrushUnderline color="#B5563C" width={140} className="mt-1 -ml-1" />
      <MetaRow
        className="mt-4"
        color="#1C1B19"
        border="rgba(28,27,25,0.15)"
        items={[{ icon: 'fork', label: 'Dine-In' }, { icon: 'clock', label: 'Open Daily' }]}
      />
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

/** Jewel-box menu card: deep wine background, gold hairline frame, italic display
   headline, and a medallion-style circular portrait ringed with concentric accents. */
const RestaurantMenuSpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#3A1620] text-[#F3E7D8] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#C9A24B" x="15%" y="10%" opacity={0.22} />
    <LightWash color="#8A2E42" x="90%" y="95%" opacity={0.35} />
    <HalftoneDots color="#C9A24B" opacity={0.25} corner="tl" />
    <Grain opacity={0.07} />
    <div className="absolute inset-3 border border-[#C9A24B]/30 pointer-events-none z-10" />
    <CornerMarks color="#C9A24B" inset={20} size={12} />

    <div className="relative z-20 flex justify-between items-start mb-2">
      {content.logo_url ? (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-[#C9A24B]/60 object-cover" />
      ) : <span />}
      <Eyebrow className="text-[#C9A24B] text-right" icon="wine">{content.tagline}</Eyebrow>
    </div>

    <div className="relative z-20 flex-grow flex flex-col items-center text-center justify-center px-2">
      <h1 className="font-fraunces italic text-4xl leading-[1.08] text-[#F3E7D8] max-w-[92%]">{content.headline}</h1>
      <OrnamentRule color="#C9A24B" className="my-5" />
      {content.image_url && (
        <div className="relative mb-5">
          <AccentRings color="#C9A24B" size={190} />
          <div className="relative w-40 h-40 rounded-full overflow-hidden border border-[#C9A24B]/50">
            <img src={content.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
      <p className="text-[12px] font-light text-[#F3E7D8]/75 leading-relaxed max-w-[85%]">{content.details}</p>
    </div>

    <div className="relative z-20 flex flex-col items-center gap-3 pt-4">
      <MetaRow
        color="#C9A24B"
        border="rgba(201,162,75,0.35)"
        items={[{ icon: 'calendar', label: 'Weekends' }, { icon: 'wine', label: 'Chef\u2019s Table' }]}
      />
      <span className="border border-[#C9A24B] text-[#C9A24B] text-[11px] font-medium tracking-[0.08em] px-7 py-2.5 rounded-full">
        {content.cta}
      </span>
    </div>
    <Watermark dark />
  </div>
);

/** Moody evening invite: photo band stitched into a color panel with a wave seam,
   glass-panel detail copy, and a reservations/full-bar credibility strip. */
const RestaurantEventDinner = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1C1210] text-[#F3E7D8] ${getRatioClasses(aspect_ratio)} flex flex-col`}>
    <LightWash color="#E0793C" x="20%" y="0%" opacity={0.25} />
    <Grain opacity={0.06} />

    {content.image_url && (
      <div className="h-[45%] w-full relative z-10">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1210] via-[#1C1210]/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1210]/50 via-transparent to-transparent" />
        <WaveDivider color="#1C1210" />
      </div>
    )}

    <div className={`relative z-10 px-7 flex-grow flex flex-col justify-end pb-7 ${!content.image_url ? 'justify-center pt-7' : 'pt-2'}`}>
      <Eyebrow className="text-[#C9A24B] mb-3" icon="flame">{content.tagline}</Eyebrow>
      <h1 className="font-fraunces text-[2.5rem] font-medium leading-[0.94] mb-4 max-w-[92%]">{content.headline}</h1>
      <GlassPanel className="p-4 mb-4" border="rgba(201,162,75,0.25)">
        <p className="text-[12px] font-light text-[#F3E7D8]/80 leading-relaxed">{content.details}</p>
      </GlassPanel>
      <MetaRow
        className="mb-5"
        color="#C9A24B"
        border="rgba(201,162,75,0.35)"
        items={[{ icon: 'calendar', label: 'Reservations' }, { icon: 'wine', label: 'Full Bar' }]}
      />
      <div className="flex justify-between items-center pt-4 border-t border-[#F3E7D8]/15">
        <span className="text-[#C9A24B] text-[11px] font-semibold tracking-[0.1em] uppercase">{content.cta}</span>
        <FooterMeta logo={content.logo_url} textColor="#F3E7D8" ringColor="rgba(201,162,75,0.5)" />
      </div>
    </div>
    <Watermark dark />
  </div>
);

/** Recruiting poster: folded corner ribbon, dot-grid + diagonal texture on ink ground,
   oversized serif headline, and a shift/apply meta row above the framed photo. */
const RestaurantHiringChef = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1C1B19] text-[#F6F1E9] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#656B45" x="100%" y="100%" opacity={0.3} />
    <DotGrid color="#F6F1E9" opacity={0.04} />
    <DiagonalStripes color="#F6F1E9" opacity={0.03} />
    <Grain opacity={0.05} />
    <FoldedRibbon text="Hiring" bg="#C9A24B" fg="#1C1B19" corner="tr" />

    <div className="relative z-10 flex justify-between items-start mb-7">
      <Eyebrow className="text-[#C9A24B] border border-[#C9A24B]/40 rounded-full px-3 py-1.5" icon="fork">{content.tagline}</Eyebrow>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full object-cover border border-white/20" />
      )}
    </div>

    <h1 className="relative z-10 font-fraunces text-[2.85rem] font-medium leading-[0.9] mb-1">{content.headline}</h1>
    <p className="relative z-10 text-[11px] uppercase tracking-[0.16em] text-white/40 mb-4">Now interviewing — apply within</p>
    <MetaRow
      className="relative z-10 mb-6"
      color="#F6F1E9"
      border="rgba(246,241,233,0.2)"
      items={[{ icon: 'calendar', label: 'All Shifts' }, { icon: 'check', label: 'Apply Today' }]}
    />

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

/** Celebratory coupon: sunburst rays and confetti behind a wine backdrop, the offer
   itself rendered as a circular medallion badge, photo mounted as a ticket stub. */
const RestaurantDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#5C1F2E] text-[#F6F1E9] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center`}>
    <SunburstRays color="#E8B4A0" opacity={0.16} size={320} />
    <LightWash color="#E0793C" x="50%" y="0%" opacity={0.22} />
    <Grain opacity={0.06} />
    <ConfettiScatter colors={['#C9A24B', '#E8B4A0', '#F6F1E9']} />
    <CornerMarks color="#E8B4A0" inset={16} size={12} />

    {content.logo_url && (
      <img src={content.logo_url} alt="logo" className="absolute top-6 left-6 w-10 h-10 rounded-full border border-white/40 object-cover z-20" />
    )}

    <Eyebrow className="relative z-10 text-[#E8B4A0] mt-3 mb-4">{content.tagline}</Eyebrow>

    <div className="relative z-10 mb-4">
      <MedallionBadge text={content.headline} bg="#F6F1E9" fg="#5C1F2E" ring="#E8B4A0" size={128} />
    </div>

    {content.image_url ? (
      <TicketStub pageColor="#5C1F2E" className="relative z-10 w-full flex-grow my-2">
        <FramedImage src={content.image_url} frameColor="#E8B4A0" radius="rounded-sm" ratio="w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-[#5C1F2E]/75 to-transparent" />
        </FramedImage>
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-[#F6F1E9]/0" />
      </TicketStub>
    ) : <div className="relative z-10 flex-grow" />}

    <MetaRow
      className="relative z-10 justify-center mb-4"
      color="#E8B4A0"
      border="rgba(232,180,160,0.4)"
      items={[{ icon: 'clock', label: 'Limited Time' }, { icon: 'check', label: 'No Code Needed' }]}
    />
    <p className="relative z-10 text-[12px] font-light text-[#F6F1E9]/80 mb-5 max-w-[85%] leading-relaxed">{content.details}</p>

    <PriceTag text={content.cta} bg="#F6F1E9" fg="#5C1F2E" className="relative z-10 shadow-lg mb-2" />
    <Watermark dark />
  </div>
);

/** Formal announcement: botanical ivory ground, double-rule frame, a round opening
   seal stamp opposite the logo, and confetti scattered through the texture layer. */
const RestaurantGrandOpening = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#F6F1E9] text-[#26311F] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#656B45" x="10%" y="100%" opacity={0.15} />
    <Grain opacity={0.04} />
    <ConfettiScatter colors={['#C9A24B', '#656B45', '#B5563C']} />
    <div className="absolute inset-2.5 border border-[#26311F]/15 pointer-events-none z-10" />
    <CornerMarks color="#C9A24B" inset={16} size={14} />

    <div className="relative z-20 flex items-start justify-between">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-full object-cover border-2 border-[#C9A24B]" />
      )}
      <SealStamp label="Opening" color="#656B45" size={58} />
    </div>

    <div className="relative z-20 text-center -mt-6">
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
      <p className="text-[11px] text-[#26311F]/65 mb-4 px-6 leading-relaxed">{content.details}</p>
      <MetaRow
        className="justify-center mb-5"
        color="#26311F"
        border="rgba(38,49,31,0.2)"
        items={[{ icon: 'calendar', label: 'This Weekend' }, { icon: 'fork', label: 'Live Tastings' }]}
      />
      <span className="inline-block bg-[#26311F] text-[#C9A24B] text-[11px] font-semibold tracking-[0.08em] px-7 py-2.5 rounded-full">
        {content.cta}
      </span>
    </div>
    <Watermark />
  </div>
);

/* ============================================================================================
   SALON TEMPLATES
   Tokens — plum #3A2436 · blush #EFE3DA · mocha #7A5C4C · champagne gold #C9A24B · rose #B98C86
   Type   — display: font-playfair (serif)  ·  body: font-sans
=============================================================================================== */

/** Soft editorial card: a floated white panel over a blush field, brush underline under
   the italic headline, framed photo, and a walk-ins/consult credibility row. */
const SalonPromoPink = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#EFE3DA] text-[#3A2436] ${getRatioClasses(aspect_ratio)} p-5 flex flex-col`}>
    <LightWash color="#B98C86" x="0%" y="0%" opacity={0.3} />
    <HalftoneDots color="#B98C86" opacity={0.5} corner="bl" />
    <div className="relative z-10 bg-[#FBF7F3] flex-grow rounded-2xl p-7 flex flex-col shadow-[0_18px_44px_-18px_rgba(58,36,54,0.28)] overflow-hidden">
      <Grain opacity={0.03} />
      <div className="flex justify-between items-start mb-6">
        {content.logo_url && (
          <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-[#C9A24B]/50 object-cover" />
        )}
        <Eyebrow className="text-[#7A5C4C] ml-auto text-right" icon="sparkle">{content.tagline}</Eyebrow>
      </div>

      <h1 className="font-playfair text-4xl italic leading-[1.05] text-[#3A2436] mb-1">{content.headline}</h1>
      <BrushUnderline color="#C9A24B" width={120} className="mb-5 -ml-1" />

      {content.image_url ? (
        <div className="flex-grow mb-6">
          <FramedImage src={content.image_url} frameColor="#C9A24B" radius="rounded-xl" ratio="w-full h-full" />
        </div>
      ) : <div className="flex-grow" />}

      <div className="bg-[#EFE3DA]/50 rounded-xl px-4 py-3 mb-4">
        <p className="text-[11px] text-[#3A2436]/65 leading-relaxed">{content.details}</p>
      </div>

      <MetaRow
        className="mb-5"
        color="#7A5C4C"
        border="rgba(122,92,76,0.25)"
        items={[{ icon: 'drop', label: 'Walk-Ins Welcome' }, { icon: 'sparkle', label: 'Free Consult' }]}
      />

      <button className="w-full bg-[#3A2436] text-[#EFE3DA] py-3.5 rounded-full font-medium text-sm tracking-wide">
        {content.cta}
      </button>
    </div>
    <Watermark />
  </div>
);

/** Spa minimal: deep plum ground, double hairline frame with fine corner marks, and a
   circular portrait set inside concentric accent rings for quiet focus. */
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
        <Eyebrow className="text-[#C9A24B] justify-center mb-3" icon="drop">{content.tagline}</Eyebrow>
        <h1 className="font-playfair text-3xl leading-snug max-w-[90%] mx-auto">{content.headline}</h1>
      </div>

      {content.image_url && (
        <div className="relative">
          <AccentRings color="#C9A24B" size={210} />
          <div className="relative w-44 h-44 rounded-full overflow-hidden border border-[#C9A24B]/40">
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

/** Luxe announcement: foil-style top/bottom rules, an opening seal stamp, confetti, and
   an opening-week/first-guests meta row beneath the supporting copy. */
const SalonGrandOpening = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#2B1A28] text-[#F3E9E4] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center`}>
    <LightWash color="#C9A24B" x="20%" y="90%" opacity={0.22} />
    <Grain opacity={0.06} />
    <ConfettiScatter colors={['#C9A24B', '#B98C86', '#F3E9E4']} />
    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent z-20" />
    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent z-20" />

    <div className="relative z-20 flex flex-col items-center w-full h-full justify-center">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-full border border-[#C9A24B]/60 object-cover mb-4" />
      )}
      <SealStamp label="Grand Open" color="#C9A24B" size={56} />
      <Eyebrow className="text-[#C9A24B] mt-4 mb-3">{content.tagline}</Eyebrow>
      <h1 className="font-playfair text-[2.3rem] leading-tight mb-6 max-w-[90%]">{content.headline}</h1>

      {content.image_url && (
        <div className="w-full h-40 mb-6">
          <FramedImage src={content.image_url} frameColor="#C9A24B" radius="rounded-sm" ratio="w-full h-full" />
        </div>
      )}

      <p className="text-[11px] font-light text-[#F3E9E4]/65 mb-5 px-4 leading-relaxed">{content.details}</p>

      <MetaRow
        className="justify-center mb-5"
        color="#C9A24B"
        border="rgba(201,162,75,0.35)"
        items={[{ icon: 'calendar', label: 'Opening Week' }, { icon: 'sparkle', label: 'First 50 Guests' }]}
      />

      <span className="border border-[#C9A24B] text-[#C9A24B] px-7 py-2.5 rounded-full text-[11px] tracking-[0.1em] font-medium">
        {content.cta}
      </span>
    </div>
    <Watermark dark />
  </div>
);

/** Recruiting card: folded 'We're Hiring' ribbon, soft blush glow, and a flexible-hours/
   all-levels meta row so the ask reads as approachable rather than corporate. */
const SalonHiringStylist = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#FBF3F0] text-[#3A2436] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#B98C86" x="100%" y="0%" opacity={0.25} />
    <Grain opacity={0.03} />
    <FoldedRibbon text="We're Hiring" bg="#3A2436" fg="#F3E9E4" corner="tr" />

    <div className="relative z-10 flex justify-between items-center mb-7">
      <Eyebrow className="text-[#B98C86]" icon="scissors">{content.tagline}</Eyebrow>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full object-cover border border-[#B98C86]/40" />
      )}
    </div>

    <h1 className="relative z-10 font-playfair text-4xl leading-[1.08] mb-1">{content.headline}</h1>
    <p className="relative z-10 text-[10px] uppercase tracking-[0.16em] text-[#3A2436]/40 mb-4">We&apos;re growing our chair family</p>
    <MetaRow
      className="relative z-10 mb-6"
      color="#3A2436"
      border="rgba(58,36,54,0.15)"
      items={[{ icon: 'calendar', label: 'Flexible Hours' }, { icon: 'check', label: 'All Levels' }]}
    />

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

/** Offer card: sunburst glow behind a fuchsia-plum ground, the discount rendered as a
   medallion badge, and the photo mounted as a dashed-edge ticket stub. */
const SalonDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#4A2038] text-[#F3E9E4] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center`}>
    <SunburstRays color="#C9A24B" opacity={0.14} size={300} />
    <LightWash color="#C9A24B" x="90%" y="10%" opacity={0.2} />
    <Grain opacity={0.06} />

    <div className="relative z-10 w-full flex justify-between items-start mb-6">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-white/25 object-cover" />
      )}
      <span className="bg-[#C9A24B] text-[#3A2436] text-[10px] font-semibold px-3.5 py-1.5 rounded-full tracking-wide ml-auto">
        {content.tagline}
      </span>
    </div>

    <div className="relative z-10 mb-5">
      <MedallionBadge text={content.headline} bg="#C9A24B" fg="#3A2436" ring="#F3E9E4" size={126} />
    </div>

    {content.image_url ? (
      <TicketStub pageColor="#4A2038" className="relative z-10 w-full flex-grow mb-5">
        <div className="w-full h-full rounded-xl overflow-hidden border border-dashed border-white/25">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      </TicketStub>
    ) : <div className="relative z-10 flex-grow" />}

    <div className="relative z-10 bg-white/8 rounded-xl px-4 py-3 mb-4 border border-white/10 w-full">
      <p className="text-[11px] font-light text-[#F3E9E4]/75 leading-relaxed">{content.details}</p>
    </div>
    <MetaRow
      className="relative z-10 justify-center mb-5"
      color="#F3E9E4"
      border="rgba(243,233,228,0.25)"
      items={[{ icon: 'clock', label: 'This Week Only' }, { icon: 'check', label: 'Book Online' }]}
    />

    <button className="relative z-10 w-full bg-[#F3E9E4] text-[#3A2436] font-semibold text-sm py-3.5 rounded-full">
      {content.cta}
    </button>
    <Watermark dark />
  </div>
);

/** Seasonal card: rose-wine ground, dashed double frame, italic gold headline, and a
   book-early/gift-cards meta row ahead of the closing CTA. */
const SalonHolidaySpecial = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#3E1723] text-[#F3E7D8] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#C9A24B" x="50%" y="100%" opacity={0.2} />
    <Grain opacity={0.06} />
    <ConfettiScatter colors={['#C9A24B', '#F3E7D8']} />
    <div className="absolute inset-3 border border-[#C9A24B]/30 pointer-events-none z-10" />
    <CornerMarks color="#C9A24B" inset={20} size={12} />

    <div className="relative z-20 flex flex-col items-center text-center h-full">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-[#C9A24B]/60 object-cover mt-2 mb-5" />
      )}

      <h1 className="font-playfair italic text-4xl mb-2 text-[#C9A24B] max-w-[90%]">{content.headline}</h1>
      <Eyebrow className="text-[#F3E7D8]/70 mb-6" icon="leaf">{content.tagline}</Eyebrow>

      {content.image_url ? (
        <div className="flex-grow w-full mb-6">
          <FramedImage src={content.image_url} frameColor="#C9A24B" radius="rounded-sm" ratio="w-full h-full" />
        </div>
      ) : <div className="flex-grow" />}

      <OrnamentRule color="#C9A24B" className="mb-5" />
      <p className="text-[11px] font-light text-[#F3E7D8]/70 mb-5 px-4 leading-relaxed">{content.details}</p>
      <MetaRow
        className="justify-center mb-5"
        color="#C9A24B"
        border="rgba(201,162,75,0.35)"
        items={[{ icon: 'calendar', label: 'Book Early' }, { icon: 'sparkle', label: 'Gift Cards' }]}
      />
      <span className="bg-[#C9A24B] text-[#3E1723] px-7 py-2.5 rounded-full text-[11px] font-semibold tracking-wide">
        {content.cta}
      </span>
    </div>
    <Watermark dark />
  </div>
);

/* ============================================================================================
   LOCAL SERVICES TEMPLATES
   Tokens — navy #14213D · steel #3E5C76 · slate #EDF1F5 · signal #E0793C · alert #C4432B · white
   Type   — display: font-inter (bold sans)  ·  body: font-sans  ·  meta: font-mono
=============================================================================================== */

/** Trade-recruiting poster: folded 'Hiring Now' ribbon, faint diagonal texture for an
   industrial feel, and an estimates/same-day credibility row above the photo. */
const ServicesHiringContractor = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#EDF1F5] text-[#14213D] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#3E5C76" x="100%" y="0%" opacity={0.18} />
    <DotGrid color="#14213D" opacity={0.04} />
    <DiagonalStripes color="#14213D" opacity={0.03} />
    <FoldedRibbon text="Hiring Now" bg="#14213D" fg="#EDF1F5" corner="tr" />

    <div className="relative z-10 flex items-center justify-between mb-7">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 rounded-lg object-cover border border-[#14213D]/10 bg-white" />
      )}
      <Eyebrow className="text-[#3E5C76] bg-white px-3.5 py-1.5 rounded-full border border-[#14213D]/10 ml-auto" icon="hardhat">
        {content.tagline}
      </Eyebrow>
    </div>

    <h1 className="relative z-10 font-inter text-[2.5rem] font-bold leading-[0.94] tracking-tight mb-1">{content.headline}</h1>
    <p className="relative z-10 font-mono text-[10px] tracking-widest text-[#3E5C76] uppercase mb-4">Licensed · Insured · Local</p>
    <MetaRow
      className="relative z-10 mb-6"
      color="#14213D"
      bg="white"
      border="rgba(20,33,61,0.1)"
      items={[{ icon: 'shield', label: 'Free Estimates' }, { icon: 'clock', label: 'Same-Day' }]}
    />

    {content.image_url ? (
      <div className="relative z-10 flex-grow mb-6 rounded-xl overflow-hidden">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <div className="relative z-10 flex items-end justify-between gap-4 pt-4 border-t border-[#14213D]/10">
      <p className="text-[11px] text-[#14213D]/60 leading-relaxed">{content.details}</p>
      <button className="shrink-0 bg-[#14213D] text-white px-5 py-3 rounded-lg font-semibold text-[12px] flex items-center gap-1.5">
        {content.cta} <IconGlyph name="arrowRight" size={13} color="#EDF1F5" />
      </button>
    </div>
    <Watermark />
  </div>
);

/** Bold navy promo: a signal-orange glow on dark ground, oversized bold headline, and
   an all-repairs/free-quote meta row anchoring the offer before the CTA. */
const ServicesPromoTerracotta = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#14213D] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#E0793C" x="100%" y="10%" opacity={0.25} />
    <Grain opacity={0.04} />

    <div className="relative z-10 flex justify-between items-start mb-7">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-11 h-11 bg-white rounded-lg p-1.5 object-cover" />
      )}
      <Eyebrow className="text-[#E0793C] ml-auto text-right" icon="bolt">{content.tagline}</Eyebrow>
    </div>

    <h1 className="relative z-10 font-inter text-[2.6rem] font-bold leading-[0.9] mb-6 max-w-[85%]">{content.headline}</h1>

    {content.image_url ? (
      <div className="relative z-10 flex-grow rounded-xl overflow-hidden mb-6 border-l-2 border-[#E0793C]">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <MetaRow
      className="relative z-10 mb-4"
      color="#E0793C"
      border="rgba(224,121,60,0.4)"
      items={[{ icon: 'wrench', label: 'All Repairs' }, { icon: 'phone', label: 'Free Quote' }]}
    />
    <div className="relative z-10 flex items-end justify-between pt-5 border-t border-white/10">
      <p className="text-[11px] text-white/55 max-w-[60%] leading-relaxed">{content.details}</p>
      <button className="bg-[#E0793C] text-[#14213D] font-semibold text-[12px] px-5 py-3 rounded-lg">
        {content.cta}
      </button>
    </div>
    <Watermark dark />
  </div>
);

/** Trust-first layout: a verified seal stamp, star rating, and a pull-quote mark inside
   a glass panel so the details copy reads like a customer testimonial. */
const ServicesGuaranteedTrust = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-white text-[#14213D] ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center border-t-[6px] border-[#3E5C76]`}>
    <DotGrid color="#3E5C76" opacity={0.06} />

    {content.logo_url && (
      <img src={content.logo_url} alt="logo" className="relative z-10 w-14 h-14 rounded-xl border border-[#14213D]/10 object-cover mt-5 mb-4" />
    )}

    <SealStamp label="Verified" color="#3E5C76" size={52} />
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

    <GlassPanel className="relative z-10 w-full p-4 mb-5" border="rgba(20,33,61,0.1)">
      <PullQuoteMark color="#3E5C76" size={30} className="block -mb-2" />
      <p className="text-[11px] text-[#14213D]/70 leading-relaxed">{content.details}</p>
    </GlassPanel>

    <button className="relative z-10 w-full bg-[#14213D] text-white py-3.5 rounded-lg font-semibold text-[12px] mb-6">
      {content.cta}
    </button>
    <Watermark />
  </div>
);

/** Modern coworking promo: dual-glow navy ground, a tour/terms meta row, and a glass
   panel footer pairing the details copy with an arrow-led CTA. */
const ServicesEventWorkspace = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#1B2540] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#E0793C" x="0%" y="100%" opacity={0.18} />
    <LightWash color="#3E5C76" x="100%" y="0%" opacity={0.22} />
    <Grain opacity={0.04} />

    <div className="relative z-10 flex justify-between items-center mb-6">
      <Eyebrow className="bg-white/10 border border-white/15 text-white px-4 py-1.5 rounded-full" icon="calendar">
        {content.tagline}
      </Eyebrow>
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-9 h-9 rounded-full border border-white/25 object-cover" />
      )}
    </div>

    <h1 className="relative z-10 font-inter text-[2.4rem] font-bold leading-[1.05] mb-4">{content.headline}</h1>
    <MetaRow
      className="relative z-10 mb-5"
      color="white"
      border="rgba(255,255,255,0.2)"
      items={[{ icon: 'calendar', label: 'Book a Tour' }, { icon: 'shield', label: 'Flexible Terms' }]}
    />

    {content.image_url ? (
      <div className="relative z-10 flex-grow rounded-xl overflow-hidden mb-6 relative">
        <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1B2540]/15" />
      </div>
    ) : <div className="relative z-10 flex-grow" />}

    <GlassPanel className="relative z-10 flex items-center justify-between p-4 mt-auto">
      <p className="text-[11px] text-white/70 w-2/3 pr-4 border-r border-white/15 leading-relaxed">{content.details}</p>
      <span className="text-[#E0793C] font-semibold text-[12px] pl-4 flex items-center gap-1">
        {content.cta} <IconGlyph name="arrowRight" size={13} color="#E0793C" />
      </span>
    </GlassPanel>
    <Watermark dark />
  </div>
);

/** High-contrast offer card: sunburst behind navy, the discount as a medallion badge,
   photo as a dashed ticket stub, and a slots/fees meta row before the button. */
const ServicesDiscountPercent = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#14213D] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col items-center text-center`}>
    <SunburstRays color="#E0793C" opacity={0.16} size={300} />
    <LightWash color="#E0793C" x="15%" y="0%" opacity={0.2} />
    <Grain opacity={0.04} />

    <div className="relative z-10 w-full flex justify-between items-start mb-6">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-lg bg-white p-1 object-cover" />
      )}
      <span className="text-[#E0793C] font-semibold text-[11px] tracking-wide uppercase border-b border-[#E0793C] pb-1 ml-auto">
        {content.tagline}
      </span>
    </div>

    <div className="relative z-10 mb-5">
      <MedallionBadge text={content.headline} bg="#E0793C" fg="#14213D" ring="#EDF1F5" size={128} />
    </div>

    {content.image_url ? (
      <TicketStub pageColor="#14213D" className="relative z-10 w-full flex-grow mb-5">
        <div className="w-full h-full rounded-xl overflow-hidden border border-dashed border-white/25">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      </TicketStub>
    ) : <div className="relative z-10 flex-grow" />}

    <div className="relative z-10 w-full">
      <p className="text-[11px] text-white/65 mb-3 leading-relaxed">{content.details}</p>
      <MetaRow
        className="mb-4"
        color="#E0793C"
        border="rgba(224,121,60,0.4)"
        items={[{ icon: 'clock', label: 'Limited Slots' }, { icon: 'check', label: 'No Hidden Fees' }]}
      />
      <button className="w-full bg-[#E0793C] text-[#14213D] py-3.5 rounded-lg font-bold text-[15px]">
        {content.cta}
      </button>
    </div>
    <Watermark dark />
  </div>
);

/** Urgent-response card: a pulsing alert chip, clock/phone meta cues, and a white
   inset card carrying the rating, quote-style details, and dispatch credibility row. */
const ServicesEmergency247 = ({ content, aspect_ratio }: PosterProps) => (
  <div className={`relative overflow-hidden bg-[#14213D] text-white ${getRatioClasses(aspect_ratio)} p-7 flex flex-col`}>
    <LightWash color="#C4432B" x="80%" y="0%" opacity={0.28} />
    <Grain opacity={0.04} />

    <div className="relative z-10 flex justify-between items-center mb-6">
      {content.logo_url && (
        <img src={content.logo_url} alt="logo" className="w-10 h-10 rounded-full border border-white/25 object-cover" />
      )}
      <span className="bg-[#C4432B] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-md flex items-center gap-1.5 ml-auto">
        <IconGlyph name="phone" size={11} color="#fff" strokeWidth={2} /> {content.tagline}
      </span>
    </div>

    <h1 className="relative z-10 font-inter text-[2.3rem] font-bold leading-[1] mb-2">{content.headline}</h1>
    <p className="relative z-10 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-white/50 mb-6">
      <IconGlyph name="clock" size={12} color="rgba(255,255,255,0.5)" /> Available around the clock
    </p>

    <div className="relative z-10 bg-white text-[#14213D] flex-grow p-5 rounded-xl shadow-lg flex flex-col">
      {content.image_url && (
        <div className="w-full h-36 rounded-lg overflow-hidden mb-4">
          <img src={content.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <Stars color="#E0793C" size="text-base" />
      <p className="text-[12px] text-[#14213D]/70 leading-relaxed border-l-2 border-[#C4432B] pl-3 mt-2 mb-3">{content.details}</p>
      <MetaRow
        className="mb-auto"
        color="#14213D"
        border="rgba(20,33,61,0.15)"
        items={[{ icon: 'phone', label: 'Dispatch Ready' }, { icon: 'shield', label: 'Licensed Techs' }]}
      />

      <button className="w-full bg-[#14213D] text-white py-3 mt-4 rounded-lg font-semibold text-[12px] tracking-wide">
        {content.cta}
      </button>
    </div>
    <Watermark dark />
  </div>
);


/* ============================================================================================
   EXPORTED DESIGN TOKENS
   ------------------------------------------------------------------------------------------
   The palettes used above, exposed as plain objects so any other part of the app — a template
   picker, a color-swatch legend, a PDF export step — can reference the same values instead of
   re-deriving them from the JSX. Keep these in sync with the inline hex values used per group.
=============================================================================================== */

export const RESTAURANT_TOKENS = {
  ink: '#1C1B19',
  ivory: '#F6F1E9',
  clay: '#B5563C',
  wine: '#5C1F2E',
  olive: '#656B45',
  gold: '#C9A24B',
  displayFont: 'font-fraunces',
  bodyFont: 'font-sans',
} as const;

export const SALON_TOKENS = {
  plum: '#3A2436',
  blush: '#EFE3DA',
  mocha: '#7A5C4C',
  champagneGold: '#C9A24B',
  rose: '#B98C86',
  displayFont: 'font-playfair',
  bodyFont: 'font-sans',
} as const;

export const SERVICES_TOKENS = {
  navy: '#14213D',
  steel: '#3E5C76',
  slate: '#EDF1F5',
  signal: '#E0793C',
  alert: '#C4432B',
  displayFont: 'font-inter',
  bodyFont: 'font-sans',
  metaFont: 'font-mono',
} as const;

export const VERTICAL_TOKENS = {
  restaurant: RESTAURANT_TOKENS,
  salon: SALON_TOKENS,
  services: SERVICES_TOKENS,
} as const;

/* ============================================================================================
   TEMPLATE METADATA
   ------------------------------------------------------------------------------------------
   Human-readable descriptions of each template, keyed the same way as POSTER_REGISTRY below.
   Intended for a template picker / gallery UI — surface `name` and `description` next to a
   thumbnail so users can choose a mood ("bold", "luxe", "urgent") rather than a raw template id.
=============================================================================================== */

export type PosterVertical = 'restaurant' | 'salon' | 'services';

export interface PosterMetadata {
  name: string;
  description: string;
  vertical: PosterVertical;
  mood: string;
}

export const POSTER_METADATA: Record<string, PosterMetadata> = {
  'restaurant-promo-bold': {
    name: 'Editorial Promo',
    description: 'Ivory ground with a clay accent, brush-stroke underline, and a framed hero shot.',
    vertical: 'restaurant',
    mood: 'Bold, editorial',
  },
  'restaurant-menu-special': {
    name: 'Jewel-Box Menu',
    description: 'Deep wine and gold, italic display type, a medallion-ringed circular portrait.',
    vertical: 'restaurant',
    mood: 'Elegant, intimate',
  },
  'restaurant-event-dinner': {
    name: 'Evening Invite',
    description: 'Photo band stitched into a dark panel with a wave seam and glass-panel copy.',
    vertical: 'restaurant',
    mood: 'Moody, upscale',
  },
  'restaurant-hiring-chef': {
    name: 'Kitchen Recruiting',
    description: 'Folded ribbon, textured ink ground, oversized serif headline for hiring pushes.',
    vertical: 'restaurant',
    mood: 'Confident, direct',
  },
  'restaurant-discount-percent': {
    name: 'Celebratory Offer',
    description: 'Sunburst and confetti behind a wine ground, offer shown as a circular medallion.',
    vertical: 'restaurant',
    mood: 'Energetic, festive',
  },
  'restaurant-grand-opening': {
    name: 'Grand Opening',
    description: 'Botanical ivory ground, double-rule frame, and a round opening seal stamp.',
    vertical: 'restaurant',
    mood: 'Formal, celebratory',
  },
  'salon-promo-pink': {
    name: 'Soft Editorial',
    description: 'A floated white panel over blush, brush-underlined italic headline, framed photo.',
    vertical: 'salon',
    mood: 'Soft, feminine',
  },
  'salon-treatment-special': {
    name: 'Spa Minimal',
    description: 'Deep plum with a fine double frame and a ringed circular portrait.',
    vertical: 'salon',
    mood: 'Calm, minimal',
  },
  'salon-grand-opening': {
    name: 'Luxe Opening',
    description: 'Foil-style rules, an opening seal stamp, and scattered confetti accents.',
    vertical: 'salon',
    mood: 'Luxe, celebratory',
  },
  'salon-hiring-stylist': {
    name: 'Chair Recruiting',
    description: "Folded 'Hiring' ribbon over a soft blush glow, approachable and warm.",
    vertical: 'salon',
    mood: 'Warm, approachable',
  },
  'salon-discount-percent': {
    name: 'Fuchsia Offer',
    description: 'Sunburst glow on a plum ground, discount shown as a medallion badge.',
    vertical: 'salon',
    mood: 'Bold, energetic',
  },
  'salon-holiday-special': {
    name: 'Seasonal Special',
    description: 'Rose-wine ground with a dashed double frame and an italic gold headline.',
    vertical: 'salon',
    mood: 'Festive, warm',
  },
  'services-hiring-contractor': {
    name: 'Trade Recruiting',
    description: 'Folded ribbon over faint diagonal texture, estimate and same-day credibility row.',
    vertical: 'services',
    mood: 'Sturdy, trustworthy',
  },
  'services-promo-terracotta': {
    name: 'Bold Navy Promo',
    description: 'Signal-orange glow on dark navy with an oversized bold headline.',
    vertical: 'services',
    mood: 'Bold, modern',
  },
  'services-guaranteed-trust': {
    name: 'Verified Trust',
    description: 'A verified seal, star rating, and pull-quote styled details panel.',
    vertical: 'services',
    mood: 'Credible, reassuring',
  },
  'services-event-workspace': {
    name: 'Workspace Promo',
    description: 'Dual-glow navy ground with a glass-panel footer and arrow-led CTA.',
    vertical: 'services',
    mood: 'Modern, professional',
  },
  'services-discount-percent': {
    name: 'High-Contrast Offer',
    description: 'Sunburst behind navy, discount as a medallion badge, photo as a ticket stub.',
    vertical: 'services',
    mood: 'Urgent, high-contrast',
  },
  'services-emergency-247': {
    name: '24/7 Emergency',
    description: 'A pulsing alert chip and a white inset card carrying rating and dispatch cues.',
    vertical: 'services',
    mood: 'Urgent, reliable',
  },
};

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