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

function LocalHero({ business }: { business: Business }) {
  const heroImage = business.featured_images[0];
  const headline = business.tagline || business.name;

  return (
    <section className="bg-[#FAF9F5] text-[#2c221e] py-16 md:py-24 border-b border-black/5 relative z-10 font-sans">
      <Container size="xl" className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 max-w-xl">
          <InView>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C27E58] mb-4 block">
              Trusted Local Service
            </span>
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B1B17] mb-6 leading-tight">
              {business.name}
            </h1>
            <p className="text-lg text-[#65554D] leading-relaxed mb-8 font-light">
              {business.description || headline}
            </p>
            <div className="flex flex-wrap gap-4">
              {business.whatsapp && (
                <Button href={`https://wa.me/${business.whatsapp}`} className="!bg-[#C27E58] !text-white hover:!bg-[#a96b48] rounded-full px-6 py-3 font-semibold text-sm">
                  Send WhatsApp
                </Button>
              )}
              {business.phone && (
                <Button href={`tel:${business.phone}`} variant="outline" className="!border-[#C27E58]/20 !text-[#C27E58] hover:!bg-[#C27E58]/5 rounded-full px-6 py-3 font-semibold text-sm">
                  Call {business.phone}
                </Button>
              )}
            </div>
          </InView>
        </div>

        <div className="lg:col-span-5">
          {heroImage ? (
            <InView delay={0.15} className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lg border border-black/5">
              <Image
                src={heroImage}
                alt={business.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 35vw, 100vw"
              />
            </InView>
          ) : (
            <div className="aspect-[4/3] rounded-[2rem] bg-[#C27E58]/10 border border-[#C27E58]/20 flex items-center justify-center">
              <span className="text-[#C27E58]/40 font-mono text-sm">Handy Work</span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function LocalServices({ business }: { business: Business }) {
  const items = business.services;
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 bg-[#FAF9F5] text-[#2c221e]">
      <Container>
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C27E58] mb-3 block">What We Help With</span>
          <h2 className="font-poppins text-3xl font-bold text-[#2B1B17]">Services We Provide</h2>
        </div>

        <RevealGroup className="grid md:grid-cols-2 gap-8" stagger={0.05}>
          {items.map((item, idx) => (
            <RevealItem key={idx} className="bg-white p-6 rounded-3xl border border-black/5 flex flex-col justify-between hover:shadow-sm">
              <div>
                <div className="flex justify-between items-baseline gap-4 mb-2">
                  <h3 className="font-poppins font-semibold text-lg text-[#2B1B17]">
                    {item.name}
                  </h3>
                  {item.price && (
                    <span className="font-mono text-sm text-[#C27E58] font-semibold">{item.price}</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-[#65554D] text-sm font-light leading-relaxed">{item.description}</p>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

function LocalHoursAndContact({ business }: { business: Business }) {
  return (
    <section className="py-20 bg-[#FAF9F5] border-t border-black/5">
      <Container className="grid md:grid-cols-2 gap-12 items-start">
        <Reveal variant="up" className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C27E58] mb-4 block">Hours</span>
          <BusinessHours business={business} className="!text-[#2B1B17]" />
        </Reveal>

        <Reveal variant="up" delay={0.1} className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C27E58] mb-2 block">Our Address</span>
          {business.address && (
            <div className="text-[#2B1B17] font-medium text-sm">
              <p>{business.address}</p>
            </div>
          )}
          {business.mapsUrl && (
            <div>
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#C27E58] text-sm font-semibold hover:underline"
              >
                Get Directions on Maps →
              </a>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

function LocalFooter({ business }: { business: Business }) {
  return (
    <footer className="bg-[#2B1B17] text-white/80 py-12 border-t border-black/10 font-sans text-xs">
      <Container className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>{business.name}</div>
        <SocialLinks business={business} className="!text-[#C27E58]" />
        <div>Powered by DevFrames</div>
      </Container>
    </footer>
  );
}

export default function ServicesLocalTemplate({ business, manifest }: TemplateProps) {
  const order = manifest.section_order;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <LocalHero key={key} business={business} />;
      case "services":
        return <LocalServices key={key} business={business} />;
      case "opening_hours":
        return <LocalHoursAndContact key={key} business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#2c221e] antialiased">
      {order.map(renderSection)}
      <LocalFooter business={business} />
      {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
    </div>
  );
}
