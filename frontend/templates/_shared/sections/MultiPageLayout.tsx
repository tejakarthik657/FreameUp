"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Menu, X, Phone, Mail, MapPin, Clock, Calendar, ArrowRight, Check, 
  ChevronDown, Star, Award, Shield, User, Globe, AlertCircle, ArrowUp,
  MessageSquare, Heart, Sparkles, BookOpen, DollarSign
} from "lucide-react";
import type { Business, RenderManifest, Hours } from "@/lib/types";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { SocialLinks } from "./SocialLinks";

interface MultiPageLayoutProps {
  business: Business;
  manifest: RenderManifest;
  children?: React.ReactNode; // Optional page override
}

export function MultiPageLayout({ business, manifest, children }: MultiPageLayoutProps) {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(true); // default true for clean SSR, set in useEffect
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  // Modals for Legal Policy Pages
  const [activeLegalModal, setActiveLegalModal] = useState<"privacy" | "terms" | "cookie" | null>(null);

  useEffect(() => {
    // Check scroll for Back-To-Top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);

    // Check cookie consent
    const consent = localStorage.getItem("devframes_cookie_consent");
    if (!consent) {
      setCookieAccepted(false);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("devframes_cookie_consent", "true");
    setCookieAccepted(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: business.category === "restaurant" ? "menu" : "services", label: business.category === "restaurant" ? "Menu" : "Services" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" }
  ];

  // Helper: Format category-specific fields dynamically
  const isRestaurant = business.category === "restaurant";
  const hasMenu = isRestaurant && business.menu && business.menu.length > 0;
  const hasServices = !isRestaurant && business.services && business.services.length > 0;
  const hasTeam = business.team && business.team.length > 0;
  const hasTestimonials = business.testimonials && business.testimonials.length > 0;

  // Render Page Content
  const renderTabContent = () => {
    if (children && activeTab === "home") return children;

    switch (activeTab) {
      case "about":
        return (
          <div className="py-12 animate-fade-in font-sans">
            {/* About Page Hero */}
            <div className="bg-[#14110F]/5 py-16 mb-16 border-y border-black/5">
              <Container>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent mb-3 block">Get to Know Us</span>
                <h1 className="text-4xl md:text-5xl font-bold text-theme-primary font-heading leading-tight tracking-tight max-w-3xl">
                  Our Journey, Vision, and Commitment to Excellence
                </h1>
              </Container>
            </div>

            <Container className="space-y-20">
              {/* Detailed Story Grid */}
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-theme-primary font-heading mb-6">How We Started</h2>
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    {business.description || `Welcome to ${business.name}. We built our company with a strong foundation of trust, quality, and commitment. From our humble beginnings, we have always prioritized customer satisfaction above all else.`}
                  </p>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Every service we provide and every project we deploy represents our core values: transparency, craftsmanship, and local community support. We work hard to ensure that your experience with us exceeds expectations.
                  </p>
                </div>
                {business.featured_images && business.featured_images[1] ? (
                  <div className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-lg border border-black/5">
                    <Image src={business.featured_images[1]} alt="About Us" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-3xl bg-theme-accent/5 border border-theme-accent/15 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-theme-accent/40" />
                  </div>
                )}
              </div>

              {/* Mission, Vision, Values */}
              <div className="grid md:grid-cols-3 gap-8 border-y border-black/5 py-12">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent mb-2">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-theme-primary">Our Mission</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    To deliver reliable, high-quality, and customer-first solutions that enrich the lives of our local community.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent mb-2">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-theme-primary">Our Vision</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    To expand our services and become the most trusted regional provider for all local business needs.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent mb-2">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-theme-primary">Our Values</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Integrity, high craftsmanship, and absolute transparency in pricing, schedules, and communication.
                  </p>
                </div>
              </div>

              {/* Business Credentials, Licensing, and Brands */}
              {(business.certifications || business.licensing_info || business.warranty_info || business.brands_used || business.ambience || business.specialties) && (
                <div className="bg-white border border-[#EAEAE8] p-8 rounded-3xl shadow-2xs space-y-6">
                  <h3 className="text-xl font-bold font-heading text-theme-primary border-b border-black/5 pb-3">Business Specifications & Credentials</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 text-xs">
                      {business.certifications && (
                        <div>
                          <span className="font-bold text-gray-500 block font-mono uppercase tracking-wider text-[10px]">Certifications & Accreditations</span>
                          <p className="text-gray-600 mt-1">{business.certifications}</p>
                        </div>
                      )}
                      {business.licensing_info && (
                        <div>
                          <span className="font-bold text-gray-500 block font-mono uppercase tracking-wider text-[10px]">Licensing Information</span>
                          <p className="text-gray-600 mt-1">{business.licensing_info}</p>
                        </div>
                      )}
                      {business.warranty_info && (
                        <div>
                          <span className="font-bold text-gray-500 block font-mono uppercase tracking-wider text-[10px]">Warranty & Service Guarantee</span>
                          <p className="text-gray-600 mt-1">{business.warranty_info}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4 text-xs">
                      {business.brands_used && (
                        <div>
                          <span className="font-bold text-gray-500 block font-mono uppercase tracking-wider text-[10px]">Brands & Materials We Use</span>
                          <p className="text-gray-600 mt-1">{business.brands_used}</p>
                        </div>
                      )}
                      {business.ambience && (
                        <div>
                          <span className="font-bold text-gray-500 block font-mono uppercase tracking-wider text-[10px]">Atmosphere & Ambience</span>
                          <p className="text-gray-600 mt-1">{business.ambience}</p>
                        </div>
                      )}
                      {business.specialties && (
                        <div>
                          <span className="font-bold text-gray-500 block font-mono uppercase tracking-wider text-[10px]">Areas of Expertise</span>
                          <p className="text-gray-600 mt-1">{business.specialties}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Team Grid */}
              {hasTeam && (
                <div>
                  <div className="text-center max-w-xl mx-auto mb-12">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent mb-2 block">Our Specialists</span>
                    <h2 className="text-3xl font-bold font-heading text-theme-primary">Meet the Professional Team</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {business.team.map((member, i) => (
                      <div key={i} className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all text-center p-6 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden relative mb-4 border-2 border-theme-accent/20">
                          {member.image ? (
                            <Image src={member.image} alt={member.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <User className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-base text-theme-primary">{member.name}</h4>
                        <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">{member.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Container>
          </div>
        );

      case "menu":
      case "services":
        return (
          <div className="py-12 animate-fade-in font-sans">
            <div className="bg-[#14110F]/5 py-16 mb-16 border-y border-black/5">
              <Container>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent mb-3 block">Catalog</span>
                <h1 className="text-4xl md:text-5xl font-bold text-theme-primary font-heading leading-tight tracking-tight max-w-3xl">
                  {isRestaurant ? "Explore Our Delicious Menu" : "Our Professional Offerings"}
                </h1>
              </Container>
            </div>

            <Container>
              {/* Category-based catalog rendering */}
              {isRestaurant && hasMenu && (
                <div className="space-y-12">
                  {/* Group items by category */}
                  {Array.from(new Set(business.menu.map(item => item.category || "General"))).map((cat, ci) => (
                    <div key={ci} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold font-heading text-theme-accent uppercase tracking-wider">{cat}</h3>
                        <div className="h-[1px] bg-black/10 flex-grow" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        {business.menu.filter(item => (item.category || "General") === cat).map((item, ii) => (
                          <div key={ii} className="flex justify-between gap-6 border-b border-black/5 pb-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-base text-theme-primary">{item.name}</h4>
                                {item.is_veg && (
                                  <span className="w-3.5 h-3.5 border border-emerald-600 rounded-sm flex items-center justify-center p-0.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-gray-500 leading-relaxed max-w-md">{item.description}</p>
                              )}
                            </div>
                            <span className="font-mono text-sm font-bold text-theme-accent whitespace-nowrap">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isRestaurant && hasServices && (
                <div className="grid md:grid-cols-2 gap-8">
                  {business.services.map((item, ii) => (
                    <div key={ii} className="bg-white border border-black/5 hover:border-theme-accent/30 p-6 rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-bold text-lg text-theme-primary">{item.name}</h4>
                          <span className="font-mono text-sm font-bold text-theme-accent bg-theme-accent/5 px-2.5 py-1 rounded-lg">{item.price}</span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                      {item.duration && (
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Duration: {item.duration}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Service/Menu Metadata Specs */}
              {(business.pricing_model || business.dietary_options || business.reservation_policy) && (
                <div className="mt-12 bg-white border border-black/5 p-6 rounded-2xl shadow-2xs grid sm:grid-cols-3 gap-6 text-center text-xs">
                  {business.pricing_model && (
                    <div className="space-y-1">
                      <span className="font-bold text-gray-500 block font-mono uppercase tracking-wider text-[9px]">Pricing Scheme</span>
                      <p className="text-gray-600">{business.pricing_model}</p>
                    </div>
                  )}
                  {business.dietary_options && (
                    <div className="space-y-1">
                      <span className="font-bold text-gray-500 block font-mono uppercase tracking-wider text-[9px]">Dietary Offerings</span>
                      <p className="text-gray-600">{business.dietary_options}</p>
                    </div>
                  )}
                  {business.reservation_policy && (
                    <div className="space-y-1">
                      <span className="font-bold text-gray-500 block font-mono uppercase tracking-wider text-[9px]">Reservation Rules</span>
                      <p className="text-gray-600">{business.reservation_policy}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Conversion Block on Services */}
              <div className="mt-16 bg-theme-accent/5 border border-theme-accent/20 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6">
                <Sparkles className="w-10 h-10 text-theme-accent mx-auto" />
                <h3 className="text-2xl font-bold font-heading text-theme-primary">Looking for a customized service request?</h3>
                <p className="text-sm text-gray-600 max-w-lg mx-auto">
                  We offer customized consultations and on-demand specialized packages. Get in touch with us today for a free quote.
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => setActiveTab("contact")} className="!bg-theme-accent !text-white rounded-full px-6 py-2.5">
                    Request a Quote
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        );

      case "faq":
        return (
          <div className="py-12 animate-fade-in font-sans">
            <div className="bg-[#14110F]/5 py-16 mb-16 border-y border-black/5">
              <Container>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent mb-3 block">Frequently Asked Questions</span>
                <h1 className="text-4xl md:text-5xl font-bold text-theme-primary font-heading leading-tight tracking-tight max-w-3xl">
                  Common Inquiries & Detailed Answers
                </h1>
              </Container>
            </div>

            <Container className="max-w-3xl">
              <div className="space-y-4">
                {[
                  {
                    q: `How can I make a booking with ${business.name}?`,
                    a: business.bookingUrl 
                      ? `You can make appointments directly through our online scheduler widget (available on the contact page or by clicking the CTA button in the header). Alternatively, give us a call at ${business.phone || "our helpline"}.`
                      : `Please fill out the contact form on our contact page, or reach out to us directly via phone (${business.phone || "N/A"}) or email (${business.email || "N/A"}) and we'll schedule you in.`
                  },
                  {
                    q: "What is your typical response time?",
                    a: business.response_time 
                      ? `We usually reply within ${business.response_time}.`
                      : "We aim to respond to all web quote requests and lead submissions within 24 hours."
                  },
                  {
                    q: "Where are you located and do you serve my area?",
                    a: business.service_area 
                      ? `Our main office is at ${business.address || "N/A"}. We actively service: ${business.service_area}.`
                      : `Our physical address is ${business.address || "N/A"}. Please contact us if you need to verify service availability in your specific neighborhood.`
                  },
                  {
                    q: "What are your cancellation/rescheduling policies?",
                    a: business.cancellation_policy 
                      ? business.cancellation_policy
                      : "We kindly request at least 24 hours notice for rescheduling or cancellations to avoid booking deposit holds."
                  },
                  {
                    q: "Are walk-ins accepted?",
                    a: business.walk_in_accepted 
                      ? "Yes, walk-ins are welcome during regular operational hours, though pre-bookings are highly recommended to avoid wait times."
                      : "We operate strictly on an appointment-only basis. Please schedule a booking prior to visiting."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)}
                      className="w-full text-left px-6 py-4 font-bold text-sm text-theme-primary flex justify-between items-center transition-all hover:bg-gray-50"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-theme-accent transition-transform duration-200 ${selectedFaq === idx ? "rotate-180" : ""}`} />
                    </button>
                    {selectedFaq === idx && (
                      <div className="px-6 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-black/5 animate-fade-in">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Container>
          </div>
        );

      case "contact":
        return (
          <div className="py-12 animate-fade-in font-sans">
            <div className="bg-[#14110F]/5 py-16 mb-16 border-y border-black/5">
              <Container>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent mb-3 block">Get In Touch</span>
                <h1 className="text-4xl md:text-5xl font-bold text-theme-primary font-heading leading-tight tracking-tight max-w-3xl">
                  Contact Us For Enquiries & Consultations
                </h1>
              </Container>
            </div>

            <Container>
              <div className="grid lg:grid-cols-12 gap-16">
                {/* Contact Forms */}
                <div className="lg:col-span-7 bg-white border border-black/5 p-8 rounded-3xl shadow-xs">
                  <h3 className="text-xl font-bold font-heading text-theme-primary mb-2">Send Us a Message</h3>
                  <p className="text-xs text-gray-500 mb-6">Fill out the secure form below to request a booking or general quote.</p>
                  <LeadCaptureForm businessId={business.id || ""} />
                </div>

                {/* Info and hours */}
                <div className="lg:col-span-5 space-y-8">
                  {/* Quick info block */}
                  <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-2xs space-y-4">
                    <h4 className="font-bold text-sm text-theme-primary border-b border-black/5 pb-2 font-mono uppercase tracking-wider">Contact Details</h4>
                    {business.phone && (
                      <div className="flex gap-3 text-xs items-center">
                        <Phone className="w-4 h-4 text-theme-accent" />
                        <a href={`tel:${business.phone}`} className="hover:underline">{business.phone}</a>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex gap-3 text-xs items-center">
                        <Mail className="w-4 h-4 text-theme-accent" />
                        <a href={`mailto:${business.email}`} className="hover:underline">{business.email}</a>
                      </div>
                    )}
                    {business.address && (
                      <div className="flex gap-3 text-xs items-start">
                        <MapPin className="w-4 h-4 text-theme-accent shrink-0 mt-0.5" />
                        <span>{business.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Additional info block */}
                  {(business.parking_info || business.accessibility || business.amenities) && (
                    <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-2xs space-y-4">
                      <h4 className="font-bold text-sm text-theme-primary border-b border-black/5 pb-2 font-mono uppercase tracking-wider">Facility Details</h4>
                      {business.parking_info && (
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-gray-500 font-mono uppercase tracking-wider text-[9px] block">Parking</span>
                          <span className="text-gray-600">{business.parking_info}</span>
                        </div>
                      )}
                      {business.accessibility && (
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-gray-500 font-mono uppercase tracking-wider text-[9px] block">Accessibility</span>
                          <span className="text-gray-600">{business.accessibility}</span>
                        </div>
                      )}
                      {business.amenities && (
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-gray-500 font-mono uppercase tracking-wider text-[9px] block">Amenities</span>
                          <span className="text-gray-600">{business.amenities}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hours Block */}
                  {business.hours && business.hours.length > 0 && (
                    <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-2xs">
                      <h4 className="font-bold text-sm text-theme-primary border-b border-black/5 pb-2 font-mono uppercase tracking-wider mb-3">Operating Hours</h4>
                      <BusinessHours hours={business.hours} />
                    </div>
                  )}

                  {/* Map Card */}
                  {business.mapsUrl && (
                    <div className="bg-white border border-black/5 p-4 rounded-2xl shadow-2xs">
                      <h4 className="font-bold text-sm text-theme-primary border-b border-black/5 pb-2 font-mono uppercase tracking-wider mb-3">Location Map</h4>
                      <div className="relative w-full h-[200px] overflow-hidden rounded-xl bg-gray-100 border">
                        <iframe 
                          src={business.mapsUrl}
                          className="w-full h-full border-none"
                          allowFullScreen={false}
                          loading="lazy"
                          title={`${business.name} location map`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </div>
        );

      default: // "home"
        return (
          <div className="animate-fade-in font-sans">
            {/* HERO */}
            <section className="relative min-h-[75vh] flex items-center bg-[#14110F] text-white overflow-hidden py-16">
              <div className="absolute inset-0 bg-[#14110F]/80 z-10" />
              {business.featured_images && business.featured_images[0] ? (
                <Image
                  src={business.featured_images[0]}
                  alt={business.name}
                  fill
                  priority
                  className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-30"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/40 to-[#14110F] z-0" />
              )}

              <Container className="z-20 relative text-center max-w-4xl space-y-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-theme-accent uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20">
                    {business.years_in_business ? `${business.years_in_business} Years Experience` : "Established Business"}
                  </span>
                  {business.emergency_service && (
                    <span className="text-[10px] font-mono tracking-[0.25em] text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      24/7 Emergency Service
                    </span>
                  )}
                  {business.price_range && (
                    <span className="text-[10px] font-mono tracking-[0.25em] text-white uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20">
                      Price: {business.price_range}
                    </span>
                  )}
                  {(business.business_type || business.cuisine_type || business.salon_type || business.service_type) && (
                    <span className="text-[10px] font-mono tracking-[0.25em] text-theme-accent uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20">
                      {business.business_type || business.cuisine_type || business.salon_type || business.service_type}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-7xl font-bold font-heading leading-tight tracking-tight text-white">
                  {business.name}
                </h1>
                <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                  {business.tagline || business.description}
                </p>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  {business.bookingUrl && (
                    <Button href={business.bookingUrl} className="!bg-theme-accent !text-[#14110F] hover:brightness-110 px-6 py-3 font-semibold text-xs tracking-wider rounded-full uppercase">
                      Book Now
                    </Button>
                  )}
                  <Button onClick={() => setActiveTab(isRestaurant ? "menu" : "services")} variant="outline" className="!border-white/20 hover:!bg-white/10 !text-white px-6 py-3 font-semibold text-xs tracking-wider rounded-full uppercase">
                    Explore Offerings
                  </Button>
                </div>
              </Container>
            </section>

            {/* TRUST CREDIBILITY & VALUE PROP */}
            <section className="py-16 bg-white border-b border-black/5">
              <Container>
                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center pb-12 border-b border-black/5 mb-12">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-theme-accent font-heading">
                      {business.years_in_business || "5+"}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Years in Service</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-theme-accent font-heading">100%</div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Satisfaction</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-theme-accent font-heading">
                      {business.walk_in_accepted ? "Walk-In" : "Appointments"}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Booking Mode</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-theme-accent font-heading">5.0 ★</div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Reviews Rating</div>
                  </div>
                </div>

                {/* Core Differentiator USP Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-6 border border-black/5 rounded-2xl bg-gray-50/50 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-theme-primary">Guaranteed Quality</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      We prioritize high craftsmanship and premium materials for every project, ensuring top-tier service.
                    </p>
                  </div>
                  <div className="p-6 border border-black/5 rounded-2xl bg-gray-50/50 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-theme-primary">Quick Response</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Time is valuable. We respond quickly and stick to scheduled times for all bookings.
                    </p>
                  </div>
                  <div className="p-6 border border-black/5 rounded-2xl bg-gray-50/50 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent">
                      <Heart className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-theme-primary">Customer Centric</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Your business needs are unique. We build and refine templates tailored exactly to your criteria.
                    </p>
                  </div>
                </div>
              </Container>
            </section>

            {/* BRIEF ABOUT PREVIEW */}
            <section className="py-20 bg-[#FAFAF8] border-b border-black/5">
              <Container className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent block">About Our Business</span>
                  <h2 className="text-3xl font-bold font-heading text-theme-primary">Bespoke copy craftsmanship built on trust.</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {business.description || `Welcome to ${business.name}. We prepare delicious recipes with love, care, and attention to detail. Every visit feels like coming home.`}
                  </p>
                  <Button onClick={() => setActiveTab("about")} className="!bg-theme-accent !text-white rounded-full px-5 py-2 mt-2">
                    Read Our Story <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline" />
                  </Button>
                </div>
                {business.featured_images && business.featured_images[1] ? (
                  <div className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-md">
                    <Image src={business.featured_images[1]} alt={business.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-3xl bg-theme-accent/5 border border-theme-accent/15 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-theme-accent/30" />
                  </div>
                )}
              </Container>
            </section>

            {/* PREVIEW CATALOG */}
            {(hasMenu || hasServices) && (
              <section className="py-20 bg-white border-b border-black/5">
                <Container className="space-y-12">
                  <div className="flex justify-between items-end gap-6 border-b border-black/5 pb-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent block mb-1">Catalog Highlight</span>
                      <h2 className="text-2xl font-bold font-heading text-theme-primary">
                        {isRestaurant ? "Bestselling Dishes" : "Popular Services"}
                      </h2>
                    </div>
                    <Button onClick={() => setActiveTab(isRestaurant ? "menu" : "services")} className="!text-theme-accent !bg-transparent hover:underline font-bold text-xs uppercase tracking-wider font-mono">
                      View Catalog Catalog <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                    </Button>
                  </div>

                  {isRestaurant && hasMenu && (
                    <div className="grid md:grid-cols-2 gap-8">
                      {business.menu.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex justify-between gap-6 pb-2 border-b border-black/5">
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-theme-primary">{item.name}</h4>
                            {item.description && <p className="text-[11px] text-gray-400 max-w-sm">{item.description}</p>}
                          </div>
                          <span className="font-mono text-xs font-bold text-theme-accent">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isRestaurant && hasServices && (
                    <div className="grid md:grid-cols-3 gap-8">
                      {business.services.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="bg-gray-50 border border-black/5 p-6 rounded-2xl space-y-2 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-theme-primary">{item.name}</h4>
                            {item.description && <p className="text-[11px] text-gray-400 leading-relaxed">{item.description}</p>}
                          </div>
                          <span className="font-mono text-xs font-bold text-theme-accent pt-2 block">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Container>
              </section>
            )}

            {/* PROCESS TIMELINE */}
            <section className="py-20 bg-[#FAFAF8] border-b border-black/5">
              <Container className="space-y-12">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent block">How We Work</span>
                  <h2 className="text-3xl font-bold font-heading text-theme-primary">Simple Step-By-Step Process</h2>
                </div>
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  {[
                    { step: "01", name: "Discover", desc: "Consultation call to map business requirements." },
                    { step: "02", name: "Plan", desc: "Resolve layout, catalog specs, and design styles." },
                    { step: "03", name: "Build", desc: "Apply AI generation rules to craft templates." },
                    { step: "04", name: "Launch", desc: "Deliver fast, secure, search-friendly static pages." }
                  ].map((x, idx) => (
                    <div key={idx} className="space-y-3 relative">
                      <div className="text-4xl font-extrabold text-theme-accent/20 font-mono tracking-tighter leading-none">{x.step}</div>
                      <h3 className="font-bold text-sm text-theme-primary">{x.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed px-4">{x.desc}</p>
                    </div>
                  ))}
                </div>
              </Container>
            </section>

            {/* TESTIMONIALS */}
            {hasTestimonials && (
              <section className="py-20 bg-white border-b border-black/5">
                <Container className="space-y-12">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent block">Client Feedback</span>
                    <h2 className="text-3xl font-bold font-heading text-theme-primary">What Our Customers Say</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {business.testimonials.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="bg-gray-50 border border-black/5 p-6 rounded-2xl space-y-4">
                        <div className="flex text-amber-500 text-sm">★★★★★</div>
                        <p className="text-xs text-gray-500 italic leading-relaxed">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                        <div>
                          <h4 className="font-bold text-xs text-theme-primary">{item.author}</h4>
                          {item.role && <p className="text-[10px] text-gray-400 font-mono">{item.role}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Container>
              </section>
            )}

            {/* MAP AND BRIEF CONTACT */}
            <section className="py-20 bg-white">
              <Container className="grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-accent block">Find Us</span>
                  <h2 className="text-3xl font-bold font-heading text-theme-primary">Schedule a meeting with us today</h2>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    We reside at {business.address || "our regional location"}. Submit a contact query to request on-site pricing evaluations.
                  </p>
                  <Button onClick={() => setActiveTab("contact")} className="!bg-theme-accent !text-white rounded-full px-6 py-2.5">
                    Contact Us Now
                  </Button>
                </div>
                <div className="lg:col-span-7 bg-gray-50 p-4 border border-black/5 rounded-3xl shadow-2xs h-[300px]">
                  {business.mapsUrl ? (
                    <iframe 
                      src={business.mapsUrl}
                      className="w-full h-full border-none rounded-2xl"
                      allowFullScreen={false}
                      loading="lazy"
                      title={`${business.name} location map`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-black/10 rounded-2xl">
                      <MapPin className="w-10 h-10 text-theme-accent/40 mb-2" />
                      <h4 className="font-bold text-sm text-theme-primary">Physical Location Address</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-xs">{business.address || "Address details not provided"}</p>
                    </div>
                  )}
                </div>
              </Container>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans antialiased text-[#2c221e] bg-[#FAF9F6]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur border-b border-black/5">
        
        {/* Optional Announcement Bar */}
        {business.tagline && (
          <div className="bg-[#14110F] text-white text-[10px] py-1.5 px-6 font-mono uppercase tracking-widest text-center select-none">
            Welcome to {business.name} &middot; {business.tagline}
          </div>
        )}

        <Container size="xl" className="flex items-center justify-between py-4">
          {/* Logo Brand Title */}
          <button onClick={() => { setActiveTab("home"); window.scrollTo(0, 0); }} className="flex items-center gap-2 group text-left">
            {business.logo ? (
              <div className="w-8 h-8 rounded-full overflow-hidden relative">
                <Image src={business.logo} alt="Logo" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-theme-accent text-white font-heading font-extrabold flex items-center justify-center text-sm rounded-full">
                {business.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="font-heading font-bold text-base tracking-tight text-theme-primary block group-hover:text-theme-accent transition-colors">
                {business.name}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); window.scrollTo(0, 0); }}
                className={`text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeTab === link.id ? "text-theme-accent font-bold" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Sticky CTA Book button */}
          <div className="flex items-center gap-4">
            {business.bookingUrl && (
              <a
                href={business.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 bg-[#9e5d3d] hover:bg-[#854d32] text-white text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-2xs transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book online</span>
              </a>
            )}

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 hover:bg-black/5 rounded-lg text-theme-primary"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#14110F]/40 backdrop-blur-xs flex justify-end md:hidden animate-fade-in">
          <div className="w-72 bg-[#FAF9F6] h-full shadow-xl flex flex-col justify-between p-6">
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-black/5">
                <span className="font-heading font-extrabold text-theme-primary">{business.name}</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-black/5 rounded-lg text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => { setActiveTab(link.id); setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                    className={`text-left text-sm font-mono uppercase tracking-wider py-2 border-b border-black/5 ${
                      activeTab === link.id ? "text-theme-accent font-bold" : "text-gray-500"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {business.bookingUrl && (
                <Button href={business.bookingUrl} className="w-full !bg-theme-accent !text-white rounded-full py-2.5 text-center">
                  Book Appointment
                </Button>
              )}
              {business.phone && (
                <a href={`tel:${business.phone}`} className="flex justify-center items-center gap-2 text-xs font-mono text-gray-500 hover:text-gray-900 py-2">
                  <Phone className="w-4 h-4" />
                  <span>{business.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Page Layout Component */}
      <main className="flex-grow">
        {renderTabContent()}
      </main>

      {/* Comprehensive Footer */}
      <footer className="bg-[#14110F] text-white/60 text-xs py-16 border-t border-white/5 font-sans">
        <Container className="space-y-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <h4 className="font-heading text-lg font-bold text-white">{business.name}</h4>
              <p className="text-white/40 leading-relaxed">
                {business.tagline || business.description || "Delivering professional, local client services."}
              </p>
              {business.phone && (
                <div className="flex gap-2.5 items-center text-white/50 text-xs font-mono">
                  <Phone className="w-3.5 h-3.5 text-theme-accent" />
                  <a href={`tel:${business.phone}`}>{business.phone}</a>
                </div>
              )}
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[10px]">Site Navigation</h5>
              <ul className="space-y-2.5">
                {navLinks.map(link => (
                  <li key={link.id}>
                    <button 
                      onClick={() => { setActiveTab(link.id); window.scrollTo(0, 0); }}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact & Socials */}
            <div className="space-y-4">
              <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[10px]">Stay Connected</h5>
              <div className="flex gap-2">
                <SocialLinks business={business} className="!text-white/50 hover:!text-white" />
              </div>
              <p className="text-[10px] text-white/30 leading-normal">
                Follow our social channels to get real-time alerts and promotional offers.
              </p>
            </div>

            {/* Column 4: Hours summary */}
            <div className="space-y-4">
              <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[10px]">Hours of Operation</h5>
              {business.hours && business.hours.length > 0 ? (
                <ul className="space-y-1.5 font-mono text-[10px] text-white/40">
                  {business.hours.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{h.day}</span>
                      <span>{h.closed ? "Closed" : `${h.open}-${h.close}`}</span>
                    </li>
                  ))}
                  <li>And more... See Contact tab.</li>
                </ul>
              ) : (
                <p className="text-[10px] text-white/40 font-mono">Mon - Sat: 9am - 6pm</p>
              )}
            </div>
          </div>

          {/* Legal Bar & Copyright */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-[10px]">
            <div>
              &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
            </div>
            <div className="flex gap-4 font-mono">
              <button onClick={() => setActiveLegalModal("privacy")} className="hover:underline">Privacy Policy</button>
              <span>&middot;</span>
              <button onClick={() => setActiveLegalModal("terms")} className="hover:underline">Terms & Conditions</button>
              <span>&middot;</span>
              <button onClick={() => setActiveLegalModal("cookie")} className="hover:underline">Cookie Policy</button>
            </div>
          </div>
        </Container>
      </footer>

      {/* Cookie Consent Banner */}
      {!cookieAccepted && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-50 bg-[#14110F] text-white border border-white/10 p-5 rounded-2xl shadow-xl space-y-4 animate-fade-in font-sans">
          <div className="space-y-1">
            <h4 className="font-bold text-xs">We value your privacy</h4>
            <p className="text-[10px] text-white/60 leading-normal">
              We use cookies to enhance website navigation, analyze traffic metrics, and improve conversion flows. By clicking accept, you consent to our privacy policies.
            </p>
          </div>
          <div className="flex justify-end gap-3 text-[10px]">
            <button onClick={() => setActiveLegalModal("cookie")} className="underline text-white/60 hover:text-white font-mono uppercase tracking-wider">Learn more</button>
            <button onClick={handleAcceptCookies} className="bg-theme-accent text-[#14110F] font-bold font-mono uppercase tracking-wider px-4 py-1.5 rounded-lg hover:brightness-110">
              Accept All
            </button>
          </div>
        </div>
      )}

      {/* Floating Utilities (WhatsApp FAB & Back-To-Top) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {showScrollTop && (
          <button 
            onClick={scrollToTop} 
            className="w-11 h-11 bg-white hover:bg-gray-50 border border-black/5 text-[#2c221e] rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
        {business.whatsapp && <WhatsAppFAB number={business.whatsapp} />}
      </div>

      {/* Legal Document Modal */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-fade-in font-sans">
          <div className="bg-white border text-gray-800 rounded-3xl w-full max-w-xl p-8 shadow-2xl relative space-y-6 max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setActiveLegalModal(null)} 
              className="absolute right-6 top-6 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {activeLegalModal === "privacy" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-heading text-theme-primary">Privacy Policy</h3>
                <div className="text-xs text-gray-500 leading-relaxed space-y-3">
                  <p><strong>Last updated: August 2026</strong></p>
                  <p>Your privacy is important to us. It is {business.name}&apos;s policy to respect your privacy regarding any information we may collect from you across our website.</p>
                  <h4 className="font-bold text-sm text-theme-primary mt-4">1. Information We Collect</h4>
                  <p>We only collect personal information such as name, email, and phone number when you voluntarily submit queries via our lead capture quote request forms.</p>
                  <h4 className="font-bold text-sm text-theme-primary mt-4">2. How We Use Information</h4>
                  <p>We use the collected information solely to contact you regarding quote requests, bookings, or inquiries made through the website. We do not sell or share information with third parties.</p>
                </div>
              </div>
            )}

            {activeLegalModal === "terms" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-heading text-theme-primary">Terms & Conditions</h3>
                <div className="text-xs text-gray-500 leading-relaxed space-y-3">
                  <p><strong>Last updated: August 2026</strong></p>
                  <p>By accessing the website of {business.name}, you agree to comply with and be bound by these terms of service, all applicable laws and regulations.</p>
                  <h4 className="font-bold text-sm text-theme-primary mt-4">1. Use License</h4>
                  <p>Permission is granted to temporarily view the materials on our website for personal, non-commercial transitory viewing only.</p>
                  <h4 className="font-bold text-sm text-theme-primary mt-4">2. Disclaimer</h4>
                  <p>The materials on our website are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties of merchantability.</p>
                </div>
              </div>
            )}

            {activeLegalModal === "cookie" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-heading text-theme-primary">Cookie Policy</h3>
                <div className="text-xs text-gray-500 leading-relaxed space-y-3">
                  <p><strong>Last updated: August 2026</strong></p>
                  <p>This is the Cookie Policy for {business.name}, accessible from our website domain.</p>
                  <h4 className="font-bold text-sm text-theme-primary mt-4">1. What Are Cookies</h4>
                  <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files downloaded to your computer, to improve your experience.</p>
                  <h4 className="font-bold text-sm text-theme-primary mt-4">2. How We Use Cookies</h4>
                  <p>We use cookies to preserve your session state, authenticate login requests, and remember if you have accepted legal disclaimer modals. We do not use cookies to run third-party targeting campaigns.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => setActiveLegalModal(null)} className="!bg-theme-accent !text-white rounded-full px-6">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
