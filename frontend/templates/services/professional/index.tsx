"use client";

import Image from "next/image";
import type { Business, RenderManifest } from "@/lib/types";
import { TemplateProps } from "@/templates/types";
import { Container } from "@/templates/_shared/ui/Container";
import { Button } from "@/templates/_shared/ui/Button";
import { InView } from "@/templates/_shared/motion/InView";
import { BusinessHours } from "@/templates/_shared/sections/BusinessHours";
import { SocialLinks } from "@/templates/_shared/sections/SocialLinks";
import { WhatsAppFAB } from "@/templates/_shared/sections/WhatsAppFAB";

function HeaderSection({ business }: { business: Business }) {
  return (
    <header className="border-b border-black/10 bg-[#FAFAF8]/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9e5d3d]">{business.name}</div>
          {business.tagline && (
            <div className="mt-1 text-xs font-sans text-[#6d5a50] hidden sm:block">{business.tagline}</div>
          )}
        </div>
        {business.phone && (
          <a href={`tel:${business.phone}`} className="rounded-full bg-[#9e5d3d] px-4 py-2 font-sans text-xs font-semibold text-white hover:bg-[#854d32] transition-colors">
            {business.phone}
          </a>
        )}
      </div>
    </header>
  );
}

function EditorialHero({ business }: { business: Business }) {
  const heroImage = business.featured_images[0];
  const headline = business.tagline || business.name;

  return (
    <section className="bg-[#FAFAF8] text-[#241813] py-16 md:py-24">
      <Container size="xl" className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 max-w-2xl">
          <InView>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9e5d3d] mb-4 block">
              Residential Services
            </span>
            <h1 className="font-sans text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-[#241813] mb-6">
              Refined care and craftsmanship for your home.
            </h1>
            <p className="text-lg text-[#6d5a50] leading-relaxed mb-8">
              {business.description || headline}
            </p>
            <div className="flex flex-wrap gap-4">
              {business.bookingUrl && (
                <Button href={business.bookingUrl} className="!bg-[#9e5d3d] !text-white hover:!bg-[#854d32] rounded-full px-6 py-3 font-semibold text-sm transition-colors">
                  Request a Quote
                </Button>
              )}
              {business.phone && (
                <Button href={`tel:${business.phone}`} variant="outline" className="!border-black/10 hover:!bg-black/5 rounded-full px-6 py-3 font-semibold text-[#241813] text-sm">
                  Call Us
                </Button>
              )}
            </div>
          </InView>
        </div>

        <div className="lg:col-span-5">
          {heroImage ? (
            <InView delay={0.15} className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lg">
              <Image
                src={heroImage}
                alt={business.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 35vw, 100vw"
              />
            </InView>
          ) : (
            <div className="aspect-[4/5] rounded-[2.5rem] bg-[#9e5d3d]/10 border border-[#9e5d3d]/20 flex items-center justify-center">
              <span className="text-[#9e5d3d]/40 font-mono text-sm">Fine Home Craft</span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function ServicesNumbered({ business }: { business: Business }) {
  const items = business.services;
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-[#FAFAF8] py-24 border-t border-black/5">
      <Container>
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9e5d3d] mb-4 block">
            Our Offerings
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-semibold text-[#241813]">
            Bespoke handyman & maintenance solutions.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, idx) => (
            <InView key={idx} delay={idx * 0.05}>
              <div className="rounded-[2rem] border border-black/10 bg-white p-8 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9e5d3d] font-mono">
                    Service 0{idx + 1}
                  </span>
                  <h3 className="mt-3 text-2xl font-semibold text-[#241813]">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="mt-4 text-[#6d5a50] text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.price && (
                  <div className="mt-6 font-mono text-sm text-[#9e5d3d] font-semibold">
                    Rate: {item.price}
                  </div>
                )}
              </div>
            </InView>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ImageFeature({ business }: { business: Business }) {
  const image = business.featured_images[1];
  if (!image) return null;

  return (
    <section className="bg-[#FAFAF8] py-24 border-t border-black/5">
      <Container>
        <div className="relative min-h-[500px] overflow-hidden rounded-[2.5rem] shadow-xl">
          <Image
            src={image}
            alt="Feature image"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 max-w-2xl p-8 md:p-12 text-white">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">Quality Standard</span>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold leading-tight">
              Quiet presentation, exceptional cleanups, and a respectful presence inside your home.
            </h2>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ContactCTA({ business }: { business: Business }) {
  return (
    <section className="bg-[#FAFAF8] py-24 border-t border-black/5">
      <Container className="max-w-3xl text-center">
        <InView>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9e5d3d] mb-4 block">
            Let's Discuss
          </span>
          <h2 className="font-sans text-3xl md:text-5xl font-semibold text-[#241813] mb-6">
            Ready to refresh your space?
          </h2>
          <p className="text-[#6d5a50] text-lg leading-relaxed mb-10">
            Tell us about your requirements and we will organize a detailed, transparent proposal for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {business.bookingUrl && (
              <Button href={business.bookingUrl} className="!bg-[#9e5d3d] !text-white hover:!bg-[#854d32] rounded-full px-6 py-3 font-semibold text-sm transition-colors">
                Request a Quote
              </Button>
            )}
            {business.phone && (
              <Button href={`tel:${business.phone}`} variant="outline" className="!border-black/10 hover:!bg-black/5 rounded-full px-6 py-3 font-semibold text-[#241813] text-sm">
                Call Us Directly
              </Button>
            )}
          </div>
        </InView>
      </Container>
    </section>
  );
}

function ServicesFooter({ business }: { business: Business }) {
  return (
    <footer className="bg-[#1A1209] text-white/70 py-16 font-sans">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <h3 className="font-sans text-xl font-bold text-white mb-4">{business.name}</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              {business.description || "Quiet, professional residential home maintenance services."}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-[#9e5d3d]">Details</h4>
            <div className="space-y-2 text-sm text-white/50">
              {business.address && <p>{business.address}</p>}
              {business.email && <p>{business.email}</p>}
            </div>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-[#9e5d3d]">Social</h4>
            <SocialLinks business={business} className="!text-[#9e5d3d]" />
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-white/30 font-mono">
          © {new Date().getFullYear()} {business.name}. Powered by DevFrames.
        </div>
      </Container>
    </footer>
  );
}

export default function ServicesProfessionalTemplate({ business, manifest }: TemplateProps) {
  const order = manifest.section_order;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <EditorialHero key={key} business={business} />;
      case "services":
        return <ServicesNumbered key={key} business={business} />;
      case "about":
        return <ImageFeature key={key} business={business} />;
      case "contact":
        return <ContactCTA key={key} business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#241813] antialiased">
      <HeaderSection business={business} />
      {order.map(renderSection)}
      <ServicesFooter business={business} />
      {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
    </div>
  );
}
