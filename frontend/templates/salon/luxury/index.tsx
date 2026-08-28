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

function AuroraHero({ business }: { business: Business }) {
  const heroImage = business.featured_images[0];
  const headline = business.tagline || business.name;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-pink-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {heroImage ? (
        <KenBurns duration={28} className="absolute inset-0 w-full h-full opacity-35 z-0">
          <Image
            src={heroImage}
            alt={business.name}
            fill
            priority
            className="object-cover"
          />
        </KenBurns>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#0A0A0A] to-zinc-950 z-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-black/30 z-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <Reveal variant="fade" className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          <span className="text-[#C9A84C] font-semibold text-xs uppercase tracking-[0.4em]">Premium Beauty Studio</span>
        </Reveal>

        <KineticText
          text={business.name}
          as="h1"
          className="font-playfair text-6xl md:text-8xl lg:text-[8vw] font-bold text-white mb-6 leading-none tracking-tight"
        />

        {business.tagline && (
          <Reveal variant="up" delay={0.2} className="mb-12">
            <p className="text-xl md:text-3xl font-light font-playfair tracking-tight text-white/90">
              Where Beauty Meets <span className="text-[#C9A84C] italic">Excellence</span>
            </p>
          </Reveal>
        )}

        <Reveal variant="up" delay={0.3} className="flex flex-wrap justify-center gap-6">
          {business.bookingUrl && (
            <Button href={business.bookingUrl} className="!bg-[#C9A84C] !text-[#0A0A0A] hover:!bg-[#e5c265] rounded-full px-10 py-4 font-medium text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-105">
              Book Your Experience
            </Button>
          )}
          {business.phone && (
            <Button href={`tel:${business.phone}`} variant="outline" className="!border-white/20 !text-white hover:!bg-white/10 rounded-full px-10 py-4 font-medium text-sm tracking-wider uppercase">
              Call Us
            </Button>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function TreatmentsSection({ business }: { business: Business }) {
  const items = business.services;
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 sm:py-36 bg-[#0A0A0A] border-t border-white/5 relative z-10">
      <Container>
        <div className="text-center mb-20">
          <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.28em] text-[#C9A84C]">
            Treatments
          </Reveal>
          <Reveal variant="up" delay={0.05}>
            <h2 className="font-playfair text-4xl md:text-5xl font-light italic leading-tight text-white mt-4">
              Exclusive Rituals
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.08}>
          {items.map((item, idx) => (
            <RevealItem key={idx} className="bg-white/5 border border-white/10 hover:border-[#C9A84C]/30 p-8 rounded-3xl transition-all duration-300 hover:shadow-lg group">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-[#C9A84C] font-mono text-xs">0{idx + 1}</span>
              </div>
              <h3 className="font-playfair text-2xl font-light text-white mb-3 group-hover:text-[#C9A84C] transition-colors">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
                  {item.description}
                </p>
              )}
              <div className="flex gap-4 text-xs font-mono">
                {item.price && <span className="text-[#C9A84C] font-semibold">{item.price}</span>}
                {item.duration && <span className="text-white/40">{item.duration}</span>}
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
    <section className="py-24 sm:py-36 bg-[#0A0A0A] border-t border-white/5 relative z-10">
      <Container className="grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.28em] text-[#C9A84C] mb-6">
            The Studio
          </Reveal>
          <Reveal variant="up" delay={0.05}>
            <h2 className="font-playfair text-4xl md:text-5xl font-light leading-tight text-white mb-6">
              A sanctuary of elegance.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 font-light">
              {business.description || `Welcome to ${business.name}, where every treatment is personalized to reveal your true radiance. Experience an atmosphere of luxury and sophistication.`}
            </p>
          </Reveal>
        </div>

        <div>
          {aboutImage && (
            <Parallax speed={0.15} className="aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl">
              <div className="relative h-[115%] w-full">
                <Image
                  src={aboutImage}
                  alt="Salon interior"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </Parallax>
          )}
        </div>
      </Container>
    </section>
  );
}

function GallerySection({ business }: { business: Business }) {
  const images = business.images;
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 sm:py-36 bg-[#0A0A0A] border-t border-white/5 relative z-10">
      <Container>
        <div className="text-center mb-20">
          <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.28em] text-[#C9A84C]">
            Artistry
          </Reveal>
          <Reveal variant="up" delay={0.05}>
            <h2 className="font-playfair text-4xl md:text-5xl font-light leading-tight text-white mt-4">
              Our Showcase
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, i) => (
            <MaskWipe key={i} direction="up" className="aspect-square relative w-full overflow-hidden rounded-2xl">
              <Image
                src={src}
                alt={`${business.name} look ${i}`}
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

function TestimonialsSection({ business }: { business: Business }) {
  const list = business.testimonials;
  if (!list || list.length === 0) return null;

  return (
    <section className="py-24 bg-[#0A0A0A] border-t border-white/5 relative z-10">
      <Container className="max-w-4xl text-center">
        <Reveal variant="fade" className="text-xs font-mono uppercase tracking-[0.28em] text-[#C9A84C] mb-6">
          Words from Guests
        </Reveal>
        <Reveal variant="up" delay={0.05}>
          <h2 className="font-playfair text-3xl md:text-4xl font-light italic leading-tight text-white mb-16">
            Client Testimonials
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8">
          {list.map((t, idx) => (
            <Reveal key={idx} variant="fade" delay={idx * 0.1} className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left">
              <span className="text-[#C9A84C] font-serif text-5xl leading-none block mb-4">“</span>
              <p className="text-white/80 font-sans font-light leading-relaxed mb-6 italic text-sm">
                {t.quote || (t as any).text}
              </p>
              <div className="text-xs font-mono text-[#C9A84C]">
                — {t.author} {t.role ? `, ${t.role}` : ""}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function LuxuryFooter({ business }: { business: Business }) {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 py-16 text-white/60 font-sans">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <h3 className="font-playfair text-2xl text-white mb-4">{business.name}</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              {business.tagline || business.description || "A luxury salon experience."}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-[#C9A84C]">Studio</h4>
            <div className="space-y-2 text-sm text-white/50">
              {business.address && <p>{business.address}</p>}
              {business.phone && <p>{business.phone}</p>}
            </div>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4 text-[#C9A84C]">Hours</h4>
            <BusinessHours business={business} className="!text-white/50" />
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-white/30 font-mono">
          © {new Date().getFullYear()} {business.name}. Powered by DevFrames.
        </div>
      </Container>
    </footer>
  );
}

export default function SalonLuxuryTemplate({ business, manifest }: TemplateProps) {
  const order = manifest.section_order;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <AuroraHero key={key} business={business} />;
      case "services":
        return <TreatmentsSection key={key} business={business} />;
      case "about":
        return <AboutSection key={key} business={business} />;
      case "gallery":
        return <GallerySection key={key} business={business} />;
      case "testimonials":
        return <TestimonialsSection key={key} business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white antialiased">
      {order.map(renderSection)}
      <LuxuryFooter business={business} />
      {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
    </div>
  );
}
