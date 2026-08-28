"use client";

import Image from "next/image";
import type { Business, RenderManifest } from "@/lib/types";
import { TemplateProps } from "@/templates/types";
import { Container } from "@/templates/_shared/ui/Container";
import { Button } from "@/templates/_shared/ui/Button";
import { InView } from "@/templates/_shared/motion/InView";
import { Reveal, RevealGroup, RevealItem } from "@/templates/_shared/motion/Reveal";
import { KineticText } from "@/templates/_shared/motion/KineticText";
import { BusinessHours } from "@/templates/_shared/sections/BusinessHours";
import { SocialLinks } from "@/templates/_shared/sections/SocialLinks";
import { WhatsAppFAB } from "@/templates/_shared/sections/WhatsAppFAB";

function StatementHero({ business }: { business: Business }) {
  const heroImage = business.featured_images[0];
  const headline = business.tagline || business.name;

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0D0C0B] text-white overflow-hidden">
      <div className="absolute inset-0">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={business.name}
            fill
            priority
            className="object-cover opacity-35"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#1E1711] to-[#0D0C0B]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/60 to-[#0D0C0B]/90" />
      </div>

      <Container size="xl" className="relative z-10 text-center px-6 pt-32 pb-20">
        <Reveal variant="fade">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.4em] text-[#E07A5F] mb-6">
            We Get Things Done
          </span>
        </Reveal>
        <KineticText
          text={business.name.toUpperCase()}
          as="h1"
          className="font-sans text-6xl md:text-8xl lg:text-[7.5vw] font-black leading-none mb-8 tracking-tighter"
        />
        <Reveal variant="up" delay={0.25} className="max-w-2xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
            {business.description || headline}
          </p>
        </Reveal>
        <Reveal variant="up" delay={0.3} className="flex flex-wrap justify-center gap-4">
          {business.bookingUrl && (
            <Button href={business.bookingUrl} className="!bg-[#E07A5F] !text-[#0D0C0B] hover:!bg-[#e5917a] rounded-none px-8 py-3.5 font-bold text-xs uppercase tracking-widest transition-all">
              Request a Proposal
            </Button>
          )}
          {business.phone && (
            <Button href={`tel:${business.phone}`} variant="outline" className="!border-white/20 !text-white hover:!bg-white/10 rounded-none px-8 py-3.5 font-bold text-xs uppercase tracking-widest">
              Call Now
            </Button>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

function ServicesBold({ business }: { business: Business }) {
  const items = business.services;
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 bg-[#0D0C0B] border-t border-white/5 relative z-10">
      <Container>
        <div className="mb-16 text-center lg:text-left">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#E07A5F] mb-4 block">Professional Services</span>
          <h2 className="font-sans text-4xl font-black uppercase tracking-tight text-white">Capabilities</h2>
        </div>

        <RevealGroup className="grid md:grid-cols-2 gap-8" stagger={0.05}>
          {items.map((item, idx) => (
            <RevealItem key={idx} className="bg-white/5 border border-white/10 hover:border-[#E07A5F]/40 p-8 rounded-none transition-all duration-300">
              <h3 className="font-sans text-2xl font-bold uppercase tracking-tight text-white mb-3">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
                  {item.description}
                </p>
              )}
              <div className="flex gap-4 text-xs font-mono">
                {item.price && <span className="text-[#E07A5F] font-bold">{item.price}</span>}
                {item.duration && <span className="text-white/40">{item.duration}</span>}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

function HoursAndContact({ business }: { business: Business }) {
  return (
    <section className="py-24 bg-[#0D0C0B] border-t border-white/5 relative z-10">
      <Container className="max-w-xl text-center">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#E07A5F] mb-4 block">Availability</span>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white">Open Times</h2>
        </div>
        <Reveal variant="up" className="bg-white/5 p-8 border border-white/10 text-left">
          <BusinessHours business={business} className="!text-white" />
        </Reveal>
      </Container>
    </section>
  );
}

function BoldFooter({ business }: { business: Business }) {
  return (
    <footer className="bg-[#0D0C0B] text-white/40 py-12 border-t border-white/5 font-mono text-xs">
      <Container className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>{business.name.toUpperCase()}</div>
        <SocialLinks business={business} className="!text-white/40" />
        <div>Powered by DevFrames</div>
      </Container>
    </footer>
  );
}

export default function ServicesBoldTemplate({ business, manifest }: TemplateProps) {
  const order = manifest.section_order;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <StatementHero key={key} business={business} />;
      case "services":
        return <ServicesBold key={key} business={business} />;
      case "opening_hours":
        return <HoursAndContact key={key} business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0C0B] text-white antialiased">
      {order.map(renderSection)}
      <BoldFooter business={business} />
      {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
    </div>
  );
}
