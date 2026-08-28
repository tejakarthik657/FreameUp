"use client";

import Image from "next/image";
import type { Business, RenderManifest } from "@/lib/types";
import { TemplateProps } from "@/templates/types";
import { Container } from "@/templates/_shared/ui/Container";
import { Button } from "@/templates/_shared/ui/Button";
import { InView } from "@/templates/_shared/motion/InView";
import { Parallax } from "@/templates/_shared/motion/Parallax";
import { Reveal, RevealGroup, RevealItem } from "@/templates/_shared/motion/Reveal";
import { BusinessHours } from "@/templates/_shared/sections/BusinessHours";
import { SocialLinks } from "@/templates/_shared/sections/SocialLinks";
import { WhatsAppFAB } from "@/templates/_shared/sections/WhatsAppFAB";

function SplitHero({ business }: { business: Business }) {
  const heroImage = business.featured_images[0];
  const headline = business.tagline || business.name;

  return (
    <section className="min-h-screen flex items-center bg-[#FCFBF9] text-[#2D2A26] relative z-10">
      <div className="grid md:grid-cols-2 w-full min-h-screen">
        <div className="flex items-center px-8 py-20 lg:px-16 bg-[#FCFBF9]">
          <div className="max-w-xl">
            <Reveal variant="fade">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C09678] mb-6 block">
                Beauty & Style
              </span>
            </Reveal>
            <Reveal variant="up" delay={0.15}>
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                {business.name}
              </h1>
            </Reveal>
            {business.tagline && (
              <Reveal variant="up" delay={0.25}>
                <p className="text-xl text-[#C09678] font-playfair italic mb-6">{business.tagline}</p>
              </Reveal>
            )}
            <Reveal variant="up" delay={0.3}>
              <p className="text-[#6d6660] text-base leading-relaxed mb-10">
                {business.description || `At ${business.name}, we believe in enhancing your natural beauty. Experience a personalized touch in a modern and relaxing setting.`}
              </p>
            </Reveal>
            <Reveal variant="up" delay={0.35} className="flex flex-wrap gap-4">
              {business.bookingUrl && (
                <Button href={business.bookingUrl} className="!bg-[#C09678] !text-white hover:!bg-[#a77e60] rounded-full px-8 py-3.5 font-semibold text-xs tracking-wider uppercase">
                  Book Appointment
                </Button>
              )}
              {business.phone && (
                <Button href={`tel:${business.phone}`} variant="outline" className="!border-[#C09678]/30 !text-[#C09678] hover:!bg-[#C09678]/5 rounded-full px-8 py-3.5 font-semibold text-xs tracking-wider uppercase">
                  Call Studio
                </Button>
              )}
            </Reveal>
          </div>
        </div>

        <div className="relative min-h-[400px] md:min-h-screen bg-[#F0EFEB]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={business.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FCFBF9] to-[#EAE7DC] flex items-center justify-center">
              <span className="text-[#C09678]/40 font-mono text-xs tracking-widest uppercase">Studio Portrait</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturedServices({ business }: { business: Business }) {
  const items = business.services;
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 sm:py-36 bg-[#F5F3ED] text-[#2D2A26]">
      <Container>
        <div className="max-w-3xl mb-16 text-center md:text-left">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C09678] mb-4 block">Our Treatments</span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2D2A26]">
            Services & Design Menu
          </h2>
        </div>

        <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.08}>
          {items.map((item, idx) => (
            <RevealItem key={idx} className="bg-white border border-black/5 p-8 rounded-3xl transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <h3 className="font-playfair text-2xl font-bold text-[#2D2A26] mb-3">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-[#6d6660] text-sm leading-relaxed mb-6 font-light">
                  {item.description}
                </p>
              )}
              <div className="flex gap-4 text-xs font-mono">
                {item.price && <span className="text-[#C09678] font-bold">{item.price}</span>}
                {item.duration && <span className="text-black/40">{item.duration}</span>}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

function AboutSection({ business }: { business: Business }) {
  const aboutImage = business.featured_images[1];

  return (
    <section className="py-24 sm:py-36 bg-[#FCFBF9] text-[#2D2A26]">
      <Container>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {aboutImage && (
            <Reveal variant="scale" className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-lg border-4 border-white">
              <Image
                src={aboutImage}
                alt="About us"
                fill
                className="object-cover"
              />
            </Reveal>
          )}
          <div>
            <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.25em] text-[#C09678] mb-4 block">The Ritual</Reveal>
            <Reveal variant="up" delay={0.05}>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2D2A26] mb-6">
                Enhance your natural radiance.
              </h2>
            </Reveal>
            <Reveal variant="up" delay={0.1}>
              <p className="text-[#6d6660] text-base leading-relaxed font-light mb-8">
                {business.description || `Welcome to ${business.name}. We craft specialized rituals that help rejuvenate your look. Our experts listen and guide you step by step.`}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function GallerySection({ business }: { business: Business }) {
  const images = business.images;
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 bg-[#F5F3ED]">
      <Container>
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C09678]">Showcase</span>
          <h2 className="font-playfair text-4xl font-bold text-[#2D2A26] mt-4">Lookbook</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, i) => (
            <Reveal key={i} variant="scale" delay={i * 0.05} className="aspect-square relative overflow-hidden rounded-2xl border border-black/5 bg-white">
              <Image
                src={src}
                alt="Look image"
                fill
                className="object-cover"
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function HoursSection({ business }: { business: Business }) {
  return (
    <section className="py-24 bg-[#FCFBF9] text-[#2D2A26]">
      <Container className="max-w-xl">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C09678]">Find Us</span>
          <h2 className="font-playfair text-3xl font-bold text-[#2D2A26] mt-4">Hours & Open Times</h2>
        </div>
        <Reveal variant="up" className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <BusinessHours business={business} className="!text-[#2D2A26]" />
        </Reveal>
      </Container>
    </section>
  );
}

function ModernFooter({ business }: { business: Business }) {
  return (
    <footer className="bg-[#2D2A26] text-white/70 py-16 font-sans">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <h3 className="font-playfair text-2xl text-white mb-4">{business.name}</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              {business.tagline || business.description || "A modern beauty experience."}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-[#C09678]">Studio</h4>
            <div className="space-y-2 text-sm text-white/50">
              {business.address && <p>{business.address}</p>}
              {business.phone && <p>{business.phone}</p>}
            </div>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-[#C09678]">Social</h4>
            <SocialLinks business={business} className="!text-[#C09678]" />
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-white/30 font-mono">
          © {new Date().getFullYear()} {business.name}. Powered by DevFrames.
        </div>
      </Container>
    </footer>
  );
}

export default function SalonModernTemplate({ business, manifest }: TemplateProps) {
  const order = manifest.section_order;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <SplitHero key={key} business={business} />;
      case "services":
        return <FeaturedServices key={key} business={business} />;
      case "about":
        return <AboutSection key={key} business={business} />;
      case "gallery":
        return <GallerySection key={key} business={business} />;
      case "opening_hours":
        return <HoursSection key={key} business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#2D2A26] antialiased">
      {order.map(renderSection)}
      <ModernFooter business={business} />
      {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
    </div>
  );
}
