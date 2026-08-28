"use client";

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

function FullscreenBanner({ business }: { business: Business }) {
  const heroImage = business.featured_images[0];
  const headline = business.tagline || business.name;

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#111111] text-white">
      <div className="absolute inset-0">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={business.name}
            fill
            priority
            className="object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#1c1c1c] to-[#111111]" />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Container size="lg" className="relative z-10 text-center px-6">
        <Reveal variant="fade">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-white/50 mb-6 block">
            Minimal & Clean
          </span>
        </Reveal>
        <Reveal variant="up" delay={0.15}>
          <h1 className="font-poppins text-5xl md:text-7xl lg:text-9xl font-black mb-8 leading-none tracking-tighter uppercase">
            {business.name}
          </h1>
        </Reveal>
        <Reveal variant="up" delay={0.25} className="max-w-xl mx-auto mb-10">
          <p className="text-lg text-white/80 leading-relaxed font-light font-mono">
            {business.description || headline}
          </p>
        </Reveal>
        <Reveal variant="up" delay={0.3} className="flex flex-wrap justify-center gap-4">
          {business.bookingUrl && (
            <Button href={business.bookingUrl} className="!bg-white !text-black hover:!bg-white/90 rounded-none px-10 py-4 font-bold text-xs uppercase tracking-widest transition-colors">
              Book
            </Button>
          )}
          {business.phone && (
            <Button href={`tel:${business.phone}`} variant="outline" className="!border-white/20 !text-white hover:!bg-white/10 rounded-none px-10 py-4 font-bold text-xs uppercase tracking-widest transition-colors">
              Call
            </Button>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

function ServiceAccordion({ business }: { business: Business }) {
  const items = business.services;
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 bg-[#111111] text-white border-t border-white/10">
      <Container className="max-w-3xl">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-white/50 mb-4 block">Treatments</span>
          <h2 className="font-poppins text-3xl font-black uppercase tracking-tight text-white">Menu</h2>
        </div>

        <RevealGroup className="divide-y divide-white/10" stagger={0.08}>
          {items.map((item, idx) => (
            <RevealItem key={idx} className="py-6 flex justify-between items-baseline gap-6">
              <div>
                <h3 className="font-poppins text-xl font-bold uppercase tracking-tight text-white mb-2">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-white/60 text-sm font-light leading-relaxed max-w-lg">{item.description}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                {item.price && <p className="font-mono font-bold text-[#c9a84c] text-lg">{item.price}</p>}
                {item.duration && <p className="text-white/40 text-xs mt-1 font-mono">{item.duration}</p>}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

function GallerySection({ business }: { business: Business }) {
  const images = business.images;
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 bg-[#111111] border-t border-white/10">
      <Container>
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-white/50 mb-4 block">Looks</span>
          <h2 className="font-poppins text-3xl font-black uppercase tracking-tight text-white">Book</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, i) => (
            <Reveal key={i} variant="scale" className="aspect-square relative overflow-hidden bg-white/5 border border-white/10">
              <Image
                src={src}
                alt="Minimal look"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ContactSection({ business }: { business: Business }) {
  return (
    <section className="py-24 bg-[#111111] text-white border-t border-white/10">
      <Container className="max-w-xl">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-white/50 mb-4 block">Visit</span>
          <h2 className="font-poppins text-3xl font-black uppercase tracking-tight text-white">Hours</h2>
        </div>
        <Reveal variant="up" className="bg-[#1c1c1c] p-8 border border-white/10">
          <BusinessHours business={business} className="!text-white" />
        </Reveal>
      </Container>
    </section>
  );
}

function MinimalFooter({ business }: { business: Business }) {
  return (
    <footer className="bg-[#111111] text-white/40 py-12 border-t border-white/10 font-mono text-xs">
      <Container className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>{business.name.toUpperCase()}</div>
        <SocialLinks business={business} className="!text-white/40" />
        <div>Powered by DevFrames</div>
      </Container>
    </footer>
  );
}

export default function SalonMinimalTemplate({ business, manifest }: TemplateProps) {
  const order = manifest.section_order;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <FullscreenBanner key={key} business={business} />;
      case "services":
        return <ServiceAccordion key={key} business={business} />;
      case "gallery":
        return <GallerySection key={key} business={business} />;
      case "opening_hours":
        return <ContactSection key={key} business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white antialiased">
      {order.map(renderSection)}
      <MinimalFooter business={business} />
      {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
    </div>
  );
}
