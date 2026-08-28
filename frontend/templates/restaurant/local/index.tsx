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
    <section className="bg-[#FAF7F2] text-[#2c221e] py-16 md:py-24 border-b border-black/5 relative z-10">
      <Container size="xl" className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 max-w-xl">
          <InView>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C07D53] mb-4 block">
              Neighbourhood Spot
            </span>
            <h1 className="font-poppins text-4xl md:text-6xl font-bold text-[#2B1B17] mb-6 leading-tight">
              {business.name}
            </h1>
            <p className="text-lg text-[#65554D] leading-relaxed mb-8">
              {business.description || headline}
            </p>
            <div className="flex flex-wrap gap-4">
              {business.whatsapp && (
                <Button href={`https://wa.me/${business.whatsapp}`} className="!bg-[#C07D53] !text-white hover:!bg-[#a7663e] rounded-full px-6 py-3 font-semibold text-sm">
                  WhatsApp Contact
                </Button>
              )}
              {business.phone && (
                <Button href={`tel:${business.phone}`} variant="outline" className="!border-[#C07D53]/20 !text-[#C07D53] hover:!bg-[#C07D53]/5 rounded-full px-6 py-3 font-semibold text-sm">
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
            <div className="aspect-[4/3] rounded-[2rem] bg-[#C07D53]/10 border border-[#C07D53]/20 flex items-center justify-center">
              <span className="text-[#C07D53]/40 font-mono text-sm">Local Kitchen</span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function LocalMenu({ business }: { business: Business }) {
  const items = business.menu;
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 bg-[#FAF7F2] text-[#2c221e]">
      <Container>
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C07D53] mb-3 block">From the Kitchen</span>
          <h2 className="font-poppins text-3xl font-bold text-[#2B1B17]">Daily Specialties</h2>
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
                    <span className="font-mono text-sm text-[#C07D53] font-semibold">{item.price}</span>
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C07D53] mb-6 block">— Or View Menu Image —</span>
            <div className="relative aspect-[3/4] max-w-lg mx-auto bg-white border border-black/5 rounded-3xl overflow-hidden shadow-md">
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

function LocalHoursAndContact({ business }: { business: Business }) {
  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-black/5">
      <Container className="grid md:grid-cols-2 gap-12 items-start">
        <Reveal variant="up" className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C07D53] mb-4 block">Hours</span>
          <BusinessHours business={business} className="!text-[#2B1B17]" />
        </Reveal>

        <Reveal variant="up" delay={0.1} className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C07D53] mb-2 block">Our Location</span>
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
                className="inline-block text-[#C07D53] text-sm font-semibold hover:underline"
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
        <SocialLinks business={business} className="!text-[#C07D53]" />
        <div>Powered by DevFrames</div>
      </Container>
    </footer>
  );
}

export default function RestaurantLocalTemplate({ business, manifest }: TemplateProps) {
  const order = manifest.section_order;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <LocalHero key={key} business={business} />;
      case "menu":
        return <LocalMenu key={key} business={business} />;
      case "opening_hours":
        return <LocalHoursAndContact key={key} business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2c221e] antialiased">
      {order.map(renderSection)}
      <LocalFooter business={business} />
      {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
    </div>
  );
}
