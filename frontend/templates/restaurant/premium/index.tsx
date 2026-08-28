"use client";

import Image from "next/image";
import type { Business, RenderManifest } from "@/lib/types";
import { TemplateProps } from "@/templates/types";
import { Container } from "@/templates/_shared/ui/Container";
import { Button } from "@/templates/_shared/ui/Button";
import { InView } from "@/templates/_shared/motion/InView";
import { Parallax } from "@/templates/_shared/motion/Parallax";
import { Reveal, RevealGroup, RevealItem } from "@/templates/_shared/motion/Reveal";
import { KineticText } from "@/templates/_shared/motion/KineticText";
import { MaskWipe } from "@/templates/_shared/motion/MaskWipe";
import { KenBurns } from "@/templates/_shared/motion/KenBurns";
import { BusinessHours } from "@/templates/_shared/sections/BusinessHours";
import { SocialLinks } from "@/templates/_shared/sections/SocialLinks";
import { WhatsAppFAB } from "@/templates/_shared/sections/WhatsAppFAB";

function CinematicHero({ business }: { business: Business }) {
  const heroImage = business.featured_images[0];
  const headline = business.tagline || business.name;

  return (
    <section className="relative h-[100vh] min-h-[640px] w-full overflow-hidden bg-[#0A0A0A] flex flex-col justify-end pb-24 sm:pb-32">
      <div className="absolute inset-0">
        {heroImage ? (
          <KenBurns duration={25} className="w-full h-full">
            <Image
              src={heroImage}
              alt={business.name}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
          </KenBurns>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1c1c1c] to-[#0A0A0A]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30" />
      </div>

      <Container size="xl" className="relative z-10 text-center sm:text-left">
        <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.28em] text-[var(--theme-accent)] mb-6">
          Established & Designed
        </Reveal>
        <KineticText
          text={business.name}
          as="h1"
          className="font-serif text-display font-light text-white leading-none tracking-tighter mb-8"
        />
        {business.tagline && (
          <Reveal variant="up" delay={0.3}>
            <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed mb-12">
              {business.tagline}
            </p>
          </Reveal>
        )}
        <Reveal variant="up" delay={0.4} className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {business.bookingUrl && (
            <Button href={business.bookingUrl} className="!bg-[var(--theme-accent)] !text-[#0A0A0A] hover:!bg-[#e5c265] rounded-none px-8 py-3.5 font-mono uppercase tracking-widest text-xs">
              Reserve a Table
            </Button>
          )}
          {business.phone && (
            <Button href={`tel:${business.phone}`} variant="outline" className="!border-white/20 !text-white hover:!bg-white/10 rounded-none px-8 py-3.5 font-mono uppercase tracking-widest text-xs">
              Call {business.phone}
            </Button>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

function StorySection({ business }: { business: Business }) {
  const aboutImage = business.featured_images[1];

  return (
    <section className="overflow-hidden bg-[#0A0A0A] py-24 sm:py-36 border-t border-white/5">
      <Container className="grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1 lg:pr-8">
          <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.28em] text-[var(--theme-accent)] mb-6">
            The Philosophy
          </Reveal>
          <Reveal variant="up" delay={0.05}>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight text-white mb-6">
              Precision, fire, and the season's finest ingredients.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <p className="font-sans text-lg text-white/80 leading-relaxed mb-8">
              {business.description || `At ${business.name}, we craft memories through flavor. We believe that fine dining is a theater where the menu, the lighting, and the conversation all harmoniously blend together.`}
            </p>
          </Reveal>
        </div>

        <div className="order-1 lg:order-2">
          {aboutImage && (
            <Parallax speed={0.2} className="group aspect-[4/5] w-full overflow-hidden">
              <div className="relative h-[115%] w-full">
                <Image
                  src={aboutImage}
                  alt="Story image"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>
            </Parallax>
          )}
        </div>
      </Container>
    </section>
  );
}

function MenuSection({ business }: { business: Business }) {
  const items = business.menu;
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-[#0A0A0A] py-24 sm:py-36 border-t border-white/5">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center mb-16">
          <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.28em] text-[var(--theme-accent)]">
            The Menu
          </Reveal>
          <Reveal variant="up" delay={0.05}>
            <h2 className="font-serif text-4xl md:text-5xl font-light italic leading-tight text-white mt-4">
              Seasonal Tasting
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="divide-y divide-white/10" stagger={0.08}>
          {items.map((item, idx) => (
            <RevealItem
              key={idx}
              variant="up"
              className="group py-8 transition-transform duration-300 ease-out hover:translate-x-2"
            >
              <div className="flex justify-between items-baseline gap-4">
                <h3 className="font-serif text-2xl font-light italic leading-tight text-white transition-colors duration-300 group-hover:text-[var(--theme-accent)]">
                  {item.name}
                </h3>
                {item.price && (
                  <span className="font-mono text-sm text-[var(--theme-accent)]">{item.price}</span>
                )}
              </div>
              {item.description && (
                <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-xl">
                  {item.description}
                </p>
              )}
            </RevealItem>
          ))}
        </RevealGroup>

        {business.menu_image_url && (
          <div className="mt-16 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 mb-6">— Or View Menu Image —</p>
            <div className="relative aspect-[3/4] max-w-lg mx-auto bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-2xl">
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
      </div>
    </section>
  );
}

function GallerySection({ business }: { business: Business }) {
  const images = business.images;
  if (!images || images.length === 0) return null;

  return (
    <section className="bg-[#0A0A0A] py-24 sm:py-36 border-t border-white/5">
      <Container>
        <div className="text-center mb-16">
          <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.28em] text-[var(--theme-accent)]">
            Visuals
          </Reveal>
          <Reveal variant="up" delay={0.05}>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight text-white mt-4">
              Moments Captured
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, i) => (
            <MaskWipe key={i} direction={i % 2 === 0 ? "up" : "down"} className="aspect-square relative w-full overflow-hidden">
              <Image
                src={src}
                alt={`${business.name} image ${i}`}
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </MaskWipe>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ContactCTA({ business }: { business: Business }) {
  const ctaImage = business.featured_images[2];

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-24 sm:py-36 border-t border-white/5">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        <div>
          <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.28em] text-[var(--theme-accent)] mb-6">
            Join Us
          </Reveal>
          <Reveal variant="up" delay={0.05}>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight text-white mb-6">
              Reserve your evening.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <p className="font-sans text-lg text-white/70 leading-relaxed mb-8">
              We look forward to welcoming you. Booking in advance is highly recommended to secure your preferred date and time.
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.15} className="space-y-4 text-sm text-white/80 font-mono">
            {business.address && (
              <div className="flex gap-3">
                <span className="text-[var(--theme-accent)]">Loc:</span>
                <span>{business.address}</span>
              </div>
            )}
            {business.phone && (
              <div className="flex gap-3">
                <span className="text-[var(--theme-accent)]">Tel:</span>
                <a href={`tel:${business.phone}`} className="hover:underline">{business.phone}</a>
              </div>
            )}
          </Reveal>
        </div>

        <div>
          {ctaImage ? (
            <Parallax speed={0.1} className="aspect-[4/3] w-full overflow-hidden">
              <div className="relative h-full w-full">
                <Image
                  src={ctaImage}
                  alt="Contact background"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </Parallax>
          ) : (
            <div className="aspect-[4/3] w-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-white/20 font-mono text-xs">Maison Noir Experience</span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function PremiumFooter({ business }: { business: Business }) {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 py-16">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl text-white mb-4">{business.name}</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              {business.tagline || business.description}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-[var(--theme-accent)]">Hours</h4>
            <BusinessHours business={business} className="!text-white/60" />
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-[var(--theme-accent)]">Connect</h4>
            <SocialLinks business={business} className="!text-white/60" />
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-white/30 font-mono">
          © {new Date().getFullYear()} {business.name}. Powered by DevFrames.
        </div>
      </Container>
    </footer>
  );
}

export default function RestaurantPremiumTemplate({ business, manifest }: TemplateProps) {
  const order = manifest.section_order;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <CinematicHero key={key} business={business} />;
      case "about":
        return <StorySection key={key} business={business} />;
      case "menu":
        return <MenuSection key={key} business={business} />;
      case "gallery":
        return <GallerySection key={key} business={business} />;
      case "contact":
        return <ContactCTA key={key} business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {order.map(renderSection)}
      <PremiumFooter business={business} />
      {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
    </div>
  );
}
