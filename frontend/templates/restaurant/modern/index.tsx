"use client";

import { useState } from "react";
import Image from "next/image";
import type { Business, RenderManifest } from "@/lib/types";
import { TemplateProps } from "@/templates/types";
import { Container } from "@/templates/_shared/ui/Container";
import { Button } from "@/templates/_shared/ui/Button";
import { InView } from "@/templates/_shared/motion/InView";
import { Reveal, RevealGroup, RevealItem } from "@/templates/_shared/motion/Reveal";
import { BusinessHours } from "@/templates/_shared/sections/BusinessHours";
import { SocialLinks } from "@/templates/_shared/sections/SocialLinks";
import { WhatsAppFAB } from "@/templates/_shared/sections/WhatsAppFAB";

// SVG Separator replacement
function Separator() {
  return (
    <div className="flex justify-center my-6">
      <svg width="168" height="26" viewBox="0 0 168 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 13C14 13 14 0 28 0C42 0 42 26 56 26C70 26 70 0 84 0C98 0 98 26 112 26C126 26 126 0 140 0C154 0 154 13 168 13" stroke="#D3B59A" strokeWidth="2"/>
      </svg>
    </div>
  );
}

function WarmHero({ business }: { business: Business }) {
  const heroImage = business.featured_images[0];
  const headline = business.tagline || business.name;

  return (
    <section className="h-[80vh] xl:h-screen relative text-white bg-[#14110F] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#14110F]/90 z-10" />
      {heroImage ? (
        <Image
          src={heroImage}
          alt={business.name}
          fill
          priority
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B1B17] to-[#14110F] z-0" />
      )}

      <div className="container mx-auto h-full flex flex-col justify-center items-center z-30 relative px-6 text-center">
        <Reveal variant="fade" className="flex flex-col items-center">
          <div className="w-[120px] h-[120px] rounded-full border border-dashed border-theme-accent/40 flex items-center justify-center mb-6">
            <span className="text-[10px] font-mono tracking-widest text-theme-accent uppercase">EST. 2026</span>
          </div>
          <h1 className="font-sans text-5xl md:text-7xl font-bold text-white mb-4 leading-none tracking-tight">
            {business.name}
          </h1>
        </Reveal>
        <Separator />
        <Reveal variant="up" delay={0.2} className="max-w-[560px] mb-8">
          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
            {business.description || headline}
          </p>
        </Reveal>
        <Reveal variant="up" delay={0.3} className="flex flex-wrap gap-4 justify-center">
          {business.bookingUrl && (
            <Button href={business.bookingUrl} className="!bg-theme-accent !text-[#14110F] hover:!bg-[#e5c7ac] rounded-none px-6 py-3 font-semibold tracking-wider text-sm uppercase">
              Book a Table
            </Button>
          )}
          {business.orderUrl && (
            <Button href={business.orderUrl} className="border border-white/20 hover:bg-white/10 rounded-none px-6 py-3 font-semibold tracking-wider text-sm uppercase">
              Order Online
            </Button>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function AboutSection({ business }: { business: Business }) {
  const aboutImage = business.featured_images[1];

  return (
    <section className="py-24 bg-[#FAFAF7] text-[#2c221e]">
      <Container>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal variant="up">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent mb-4 block">Our Story</span>
              <h2 className="font-sans text-4xl md:text-5xl font-bold leading-tight text-[#2B1B17] mb-6">
                A warm bistro built on local heritage.
              </h2>
              <Separator />
              <p className="text-base text-[#65554D] leading-relaxed mb-6">
                {business.description || `Welcome to ${business.name}. We prepare delicious recipes with love, care, and attention to detail. Every visit feels like coming home.`}
              </p>
            </div>
          </Reveal>
          {aboutImage && (
            <Reveal variant="scale" delay={0.15} className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src={aboutImage}
                alt="About us image"
                fill
                className="object-cover"
              />
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}

function MenuSection({ business }: { business: Business }) {
  const items = business.menu;
  if (!items || items.length === 0) return null;

  const categories = Array.from(
    new Set(items.map((item) => item.category?.trim()).filter(Boolean))
  ) as string[];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category?.trim() === activeCategory);

  return (
    <section className="py-24 bg-[#F2ECE4] text-[#2c221e]">
      <Container>
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent mb-4">Selections</span>
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-[#2B1B17]">Our Menu</h2>
          <Separator />

          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-xl mx-auto">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-200 ${
                  activeCategory === "All"
                    ? "bg-[#2B1B17] text-white border-[#2B1B17] shadow-sm"
                    : "bg-white/40 hover:bg-white/70 text-[#2c221e] border-theme-accent/20"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#2B1B17] text-white border-[#2B1B17] shadow-sm"
                      : "bg-white/40 hover:bg-white/70 text-[#2c221e] border-theme-accent/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <RevealGroup className="grid gap-y-10 gap-x-16 md:grid-cols-2 min-h-[200px]" stagger={0.05}>
          {filteredItems.map((item, idx) => (
            <RevealItem key={item.name + idx} className="flex items-center gap-4 animate-fade-in">
              <div className="relative w-[64px] h-[64px] rounded-full overflow-hidden shrink-0 bg-white shadow border border-theme-accent/20 flex items-center justify-center">
                <span className="text-xs font-mono text-theme-accent">{idx + 1}</span>
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between gap-4 items-baseline">
                  <p className="uppercase font-sans font-semibold text-lg leading-none text-[#2B1B17]">
                    {item.name}
                  </p>
                  <div className="flex-1 border-b border-dashed border-theme-accent/80"></div>
                  {item.price && (
                    <p className="leading-none font-sans font-semibold text-xl text-[#2B1B17]">
                      {item.price}
                    </p>
                  )}
                </div>
                {item.description && (
                  <p className="text-[#65554D] text-sm font-light leading-relaxed">{item.description}</p>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {business.menu_image_url && (
          <div className="mt-16 text-center">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent mb-6 block">— Or View Menu Image —</span>
            <div className="relative aspect-[3/4] max-w-lg mx-auto bg-white/40 border border-theme-accent/30 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={business.menu_image_url}
                alt="Direct Menu Card"
                fill
                className="object-contain hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 512px"
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function OpenHoursSection({ business }: { business: Business }) {
  return (
    <section className="py-24 bg-[#FAFAF7] text-[#2c221e]">
      <Container className="max-w-xl">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent mb-4">Visit Us</span>
          <h2 className="font-sans text-3xl font-bold text-[#2B1B17]">Opening Hours</h2>
          <Separator />
        </div>
        <Reveal variant="up" className="bg-[#F2ECE4] p-8 rounded-3xl border border-theme-accent/20 shadow-sm">
          <BusinessHours business={business} className="!text-[#2B1B17]" />
        </Reveal>
      </Container>
    </section>
  );
}

function ModernFooter({ business }: { business: Business }) {
  return (
    <footer className="bg-[#2B1B17] text-white/80 py-16 border-t border-theme-accent/15 font-sans">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <h3 className="font-sans text-2xl font-bold text-white mb-4">{business.name}</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              {business.tagline || business.description || "Creating memorable bistro moments daily."}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-theme-accent">Find Us</h4>
            <div className="space-y-2 text-sm text-white/70">
              {business.address && <p>{business.address}</p>}
              {business.phone && <p>{business.phone}</p>}
            </div>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-theme-accent">Connect</h4>
            <SocialLinks business={business} className="!text-theme-accent" />
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-white/30 font-mono">
          © {new Date().getFullYear()} {business.name}. Powered by DevFrames.
        </div>
      </Container>
    </footer>
  );
}

export default function RestaurantModernTemplate({ business, manifest }: TemplateProps) {
  const order = manifest.section_order;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <WarmHero key={key} business={business} />;
      case "about":
        return <AboutSection key={key} business={business} />;
      case "menu":
        return <MenuSection key={key} business={business} />;
      case "opening_hours":
        return <OpenHoursSection key={key} business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#2c221e] antialiased">
      {order.map(renderSection)}
      <ModernFooter business={business} />
      {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
    </div>
  );
}
