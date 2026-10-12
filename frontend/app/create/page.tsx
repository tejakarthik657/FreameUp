"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Sector = "restaurant" | "salon" | "local_services" | "others";

interface MenuItem   { name: string; price: string; description: string; category: string; is_veg: boolean | null; }
interface ServiceItem { name: string; price: string; duration: string; description: string; category: string; }
interface TeamMember  { name: string; role: string; }
interface Testimonial { quote: string; author: string; role: string; }
interface DayHours    { day: string; open: string; close: string; closed: boolean; }

const DEFAULT_HOURS: DayHours[] = [
  { day: "Monday",    open: "09:00", close: "18:00", closed: false },
  { day: "Tuesday",   open: "09:00", close: "18:00", closed: false },
  { day: "Wednesday", open: "09:00", close: "18:00", closed: false },
  { day: "Thursday",  open: "09:00", close: "18:00", closed: false },
  { day: "Friday",    open: "09:00", close: "18:00", closed: false },
  { day: "Saturday",  open: "10:00", close: "16:00", closed: false },
  { day: "Sunday",    open: "",      close: "",       closed: true  },
];

const SECTOR_META: Record<Sector, {
  label: string; tag: string; color: string;
  desc: string;
  subTypeLabel: string; subTypePlaceholder: string; subTypeOptions: string[];
}> = {
  restaurant: {
    label: "Restaurant / Café", tag: "MENU + MAPS", color: "#e8b94a",
    desc: "Restaurants, cafés, bakeries, food trucks, and cloud kitchens.",
    subTypeLabel: "Cuisine Type", subTypePlaceholder: "e.g. Indian, Italian, Fast Food",
    subTypeOptions: ["Indian", "Chinese", "Italian", "Continental", "Fast Food", "Café / Bakery", "Street Food", "Multi-Cuisine"],
  },
  salon: {
    label: "Salon & Spa", tag: "BOOKING + TEAM", color: "#ff4d8b",
    desc: "Hair salons, beauty parlours, spas, barbershops, and nail studios.",
    subTypeLabel: "Salon Type", subTypePlaceholder: "e.g. Hair Salon, Spa, Barbershop",
    subTypeOptions: ["Hair Salon", "Beauty Parlour", "Spa & Wellness", "Barbershop", "Nail Studio", "Unisex Salon", "Bridal Studio"],
  },
  local_services: {
    label: "Local Services", tag: "LEADS + TRUST", color: "#ffb084",
    desc: "Plumbers, electricians, contractors, cleaners, tutors, and more.",
    subTypeLabel: "Service Type", subTypePlaceholder: "e.g. Plumbing, Electrical, Tutoring",
    subTypeOptions: ["Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning", "Tutoring", "AC Repair", "Construction"],
  },
  others: {
    label: "Others", tag: "FLEXIBLE", color: "#b8a4ed",
    desc: "Retail, fitness, healthcare, legal, photography, and any other business.",
    subTypeLabel: "Business Type", subTypePlaceholder: "e.g. Retail Shop, Gym, Clinic",
    subTypeOptions: ["Retail Shop", "Gym / Fitness", "Clinic / Healthcare", "Law Firm", "Real Estate", "Education", "Photography", "Event Planning"],
  },
};

const STEPS = ["Sector", "Brand", "Contact", "Hours", "Offerings", "Visuals"];
const MAX_IMAGES = 3;

// ─────────────────────────────────────────────
// SHARED ATOMS
// ─────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="input-label">
      {children}
      {required && <span style={{ color: "#EF4444", marginLeft: "2px" }}>*</span>}
    </label>
  );
}
function Field({ label, required, children, ai }: { label: string; required?: boolean; children: React.ReactNode; ai?: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <FieldLabel required={required}>{label}</FieldLabel>
        {ai}
      </div>
      {children}
    </div>
  );
}
function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.04em", color: "var(--text-muted)", marginTop: "5px" }}>
      {children}
    </p>
  );
}
function SectionRule({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 0" }}>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
    </div>
  );
}
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none" }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: "38px", height: "22px", borderRadius: "11px",
          background: checked ? "var(--accent)" : "var(--border-strong)",
          border: "none", cursor: "pointer", position: "relative",
          transition: "background 0.2s ease", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: "3px",
          left: checked ? "19px" : "3px",
          width: "16px", height: "16px", borderRadius: "50%", background: "white",
          transition: "left 0.2s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{label}</span>
    </label>
  );
}
function AddRowButton({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%", padding: "9px",
        border: `1px dashed ${color}50`,
        background: `${color}06`,
        borderRadius: "6px",
        fontFamily: "var(--font-mono)", fontSize: "0.62rem",
        fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
        color, cursor: "pointer",
        transition: "background 0.15s ease, border-color 0.15s ease",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}12`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}80`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}06`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}50`; }}
    >
      {label}
    </button>
  );
}
function StepHeader({ step, total, title, desc, color }: { step: number; total: number; title: string; desc: string; color: string }) {
  return (
    <div style={{ paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)", marginBottom: "1.25rem" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color }}>
        Step {step} / {total}
      </span>
      <h1 style={{ fontFamily: "var(--font-instrument-serif)", fontSize: "1.7rem", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: "4px 0 4px" }}>
        {title}
      </h1>
      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}
function NavRow({ onNext, onBack, isFirst, isLast, loading }: { onNext?: () => void; onBack?: () => void; isFirst?: boolean; isLast?: boolean; loading?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "10px", paddingTop: "1.25rem", borderTop: "1px solid var(--border)", marginTop: "0.5rem" }}>
      {!isFirst && (
        <button type="button" onClick={onBack} className="btn-base btn-outline" style={{ width: "32%", padding: "11px" }}>
          Back
        </button>
      )}
      {!isLast && (
        <button type="button" onClick={onNext} className="btn-base btn-primary" style={{ flex: 1, padding: "11px" }}>
          Continue
        </button>
      )}
      {isLast && (
        <button type="submit" disabled={loading} className="btn-base btn-primary" id="create-submit" style={{ flex: 1, padding: "11px" }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
              Generating
            </span>
          ) : "Generate website"}
        </button>
      )}
    </div>
  );
}

function AIEnhanceButton({
  fieldName,
  currentValue,
  category,
  context,
  onEnhanced,
  color,
}: {
  fieldName: string;
  currentValue: string;
  category: string;
  context: Record<string, unknown>;
  onEnhanced: (val: string) => void;
  color: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleEnhance() {
    setLoading(true);
    try {
      const res = await api.enhanceField({
        field_name: fieldName,
        current_value: currentValue,
        category,
        context,
      });
      if (res.enhanced_value) {
        onEnhanced(res.enhanced_value);
      }
    } catch (err) {
      console.error("AI enhancement failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleEnhance}
      disabled={loading}
      style={{
        padding: "4px 8px",
        background: loading ? "var(--surface-high)" : `${color}12`,
        border: `1px solid ${loading ? "var(--border)" : `${color}30`}`,
        borderRadius: "4px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.58rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: loading ? "var(--text-muted)" : color,
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        transition: "background 0.15s ease",
      }}
    >
      {loading ? (
        <>
          <span style={{ width: "10px", height: "10px", border: "1.5px solid rgba(0,0,0,0.1)", borderTopColor: color, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
          Enhancing...
        </>
      ) : (
        "✨ AI Autofill"
      )}
    </button>
  );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function CreateBusinessPage() {
  const router = useRouter();
  const [step, setStep]           = useState(1);
  const [dir,  setDir]            = useState<"f" | "b">("f");

  // S1 – Sector
  const [sector, setSector]       = useState<Sector>("restaurant");

  // S2 – Brand
  const [name,            setName]           = useState("");
  const [tagline,         setTagline]        = useState("");
  const [description,     setDescription]    = useState("");
  const [logo,            setLogo]           = useState("");
  const [logoUploading,   setLogoUploading]  = useState(false);
  const [isDragging,      setIsDragging]     = useState(false);
  const [subType,         setSubType]        = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");

  // S3 – Contact
  const [phone,       setPhone]      = useState("");
  const [whatsapp,    setWhatsapp]   = useState("");
  const [email,       setEmail]      = useState("");
  const [address,     setAddress]    = useState("");
  const [mapsUrl,     setMapsUrl]    = useState("");
  const [instagram,   setInstagram]  = useState("");
  const [facebook,    setFacebook]   = useState("");
  const [websiteUrl,  setWebsiteUrl] = useState("");
  const [bookingUrl,  setBookingUrl] = useState("");
  const [orderUrl,    setOrderUrl]   = useState("");
  const [serviceArea, setServiceArea] = useState("");

  // S4 – Hours
  const [hours,            setHours]            = useState<DayHours[]>(DEFAULT_HOURS);
  const [emergencyService, setEmergencyService] = useState(false);
  const [responseTime,     setResponseTime]     = useState("");
  const [walkInAccepted,   setWalkInAccepted]   = useState(false);

  // New advanced fields state
  const [priceRange, setPriceRange] = useState("");
  const [dietaryOptions, setDietaryOptions] = useState("");
  const [reservationPolicy, setReservationPolicy] = useState("");
  const [parkingInfo, setParkingInfo] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [ambience, setAmbience] = useState("");
  const [brandsUsed, setBrandsUsed] = useState("");
  const [amenities, setAmenities] = useState("");
  const [accessibility, setAccessibility] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [licensingInfo, setLicensingInfo] = useState("");
  const [warrantyInfo, setWarrantyInfo] = useState("");
  const [pricingModel, setPricingModel] = useState("");
  const [menuImageUrl, setMenuImageUrl] = useState("");
  const [menuImageUploading, setMenuImageUploading] = useState(false);

  // Bulk offerings state
  const [bulkText, setBulkText] = useState("");
  const [parsingBulk, setParsingBulk] = useState(false);

  // S5 – Offerings
  const [menuItems,    setMenuItems]    = useState<MenuItem[]>([{ name: "", price: "", description: "", category: "Mains", is_veg: null }]);
  const [salonSvcs,    setSalonSvcs]    = useState<ServiceItem[]>([{ name: "", price: "", duration: "", description: "", category: "Hair" }]);
  const [localSvcs,    setLocalSvcs]    = useState<ServiceItem[]>([{ name: "", price: "", duration: "", description: "", category: "" }]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([{ quote: "", author: "", role: "" }]);
  const [certifications, setCertifications] = useState("");
  const [teamMembers,  setTeamMembers]  = useState<TeamMember[]>([{ name: "", role: "" }]);

  // S6 – Visuals
  const [featuredImages, setFeaturedImages] = useState<string[]>([]);
  const [uploading,      setUploading]      = useState(false);
  const [stockImages,    setStockImages]    = useState<{ id: string; url: string; alt: string }[]>([]);
  const [showStock,      setShowStock]      = useState(false);

  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const meta = SECTOR_META[sector];

  useEffect(() => {
    const cat = sector === "others" ? "local_services" : sector;
    api.listStockImages(cat).then((r) => setStockImages(r.images)).catch(() => {});
  }, [sector]);

  function goNext() {
    setError(null);
    if (step === 2 && !name.trim()) { setError("Business name is required."); return; }
    setDir("f");
    setStep((s) => Math.min(s + 1, STEPS.length));
  }
  function goBack() { setError(null); setDir("b"); setStep((s) => Math.max(s - 1, 1)); }

  async function handleLogoUpload(file: File) {
    setLogoUploading(true); setError(null);
    try { const { url } = await api.uploadImage(file); setLogo(url); }
    catch { setError("Logo upload failed"); }
    finally { setLogoUploading(false); }
  }
  async function handleImageUpload(file: File) {
    if (featuredImages.length >= MAX_IMAGES) return;
    setUploading(true); setError(null);
    try { const { url } = await api.uploadImage(file); setFeaturedImages((p) => [...p, url]); }
    catch { setError("Image upload failed"); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(null); setLoading(true);
    const finalMenu     = sector === "restaurant" ? menuItems.filter((i) => i.name.trim()) : [];
    const finalServices = sector === "salon" ? salonSvcs.filter((i) => i.name.trim())
                        : (sector === "local_services" || sector === "others") ? localSvcs.filter((i) => i.name.trim()) : [];
    const finalTestimonials = ["local_services", "others"].includes(sector) ? testimonials.filter((t) => t.quote.trim()) : [];
    const finalTeam = ["salon", "local_services", "others"].includes(sector) ? teamMembers.filter((m) => m.name.trim()) : [];
    try {
      const payload: Record<string, unknown> = {
        category: sector, name, tagline, description,
        phone, whatsapp, email: email || undefined,
        address, maps_url: mapsUrl || undefined,
        instagram: instagram || undefined, facebook: facebook || undefined,
        website_url: websiteUrl || undefined, booking_url: bookingUrl || undefined,
        order_url: orderUrl || undefined, service_area: serviceArea || undefined,
        logo: logo || undefined,
        hours: hours.map(({ day, open, close, closed }) => ({ day, open, close, closed })),
        menu: finalMenu, services: finalServices,
        testimonials: finalTestimonials, team: finalTeam,
        featured_images: featuredImages,
        years_in_business: yearsInBusiness || undefined,
        certifications: certifications || undefined,
        price_range: priceRange || undefined,
        dietary_options: dietaryOptions || undefined,
        reservation_policy: reservationPolicy || undefined,
        parking_info: parkingInfo || undefined,
        dress_code: dressCode || undefined,
        ambience: ambience || undefined,
        brands_used: brandsUsed || undefined,
        amenities: amenities || undefined,
        accessibility: accessibility || undefined,
        cancellation_policy: cancellationPolicy || undefined,
        specialties: specialties || undefined,
        licensing_info: licensingInfo || undefined,
        warranty_info: warrantyInfo || undefined,
        pricing_model: pricingModel || undefined,
        menu_image_url: menuImageUrl || undefined,
        ...(sector === "local_services" ? { emergency_service: emergencyService, response_time: responseTime || undefined } : {}),
        ...(sector === "salon" ? { walk_in_accepted: walkInAccepted } : {}),
        ...(sector === "restaurant" ? { cuisine_type: subType || undefined } : {}),
        ...(sector === "salon"      ? { salon_type:   subType || undefined } : {}),
        ...(sector === "local_services" ? { service_type: subType || undefined } : {}),
        ...(sector === "others"     ? { business_type: subType || undefined } : {}),
      };
      const business = await api.createBusiness(payload) as { id: string };
      sessionStorage.setItem("devframes_business_id", business.id);
      sessionStorage.setItem("devframes_category", sector);
      router.push("/create/style");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#f5f5f7]">

      {/* ── STICKY HEADER ── */}
      <header className="bg-black text-white border-b border-[#272729] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-[48px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="FrameUp"
              className="w-6 h-6 rounded-lg object-contain shadow-xs"
            />
            <span className="font-semibold text-white tracking-tight text-[13px] flex items-center gap-1.5">
              FrameUp
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#0066cc]/30 text-[#2997ff] border border-[#2997ff]/30 rounded">
                OS
              </span>
            </span>
            <span className="text-[#3a3a3c] text-[11px] hidden sm:inline">|</span>
            <span className="text-[#86868b] text-[11px] font-medium hidden sm:inline">
              Site Generator
            </span>
          </div>

          {/* Step pills */}
          <div style={{ display: "flex", gap: "2px" }}>
            {STEPS.map((lbl, i) => {
              const idx = i + 1;
              const active = step === idx;
              const done   = step > idx;
              return (
                <div
                  key={lbl}
                  style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "3px 8px",
                    background: active ? `${meta.color}12` : done ? "var(--surface-high)" : "transparent",
                    border: `1px solid ${active ? `${meta.color}30` : "transparent"}`,
                    borderRadius: "4px",
                  }}
                >
                  <span style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    background: done ? meta.color : active ? meta.color : "var(--border-strong)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 700, color: "white", flexShrink: 0,
                  }}>
                    {done ? "✓" : idx}
                  </span>
                  <span className="hidden sm:inline" style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    color: active ? meta.color : done ? "var(--text-secondary)" : "var(--text-muted)",
                  }}>
                    {lbl}
                  </span>
                </div>
              );
            })}
          </div>

          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-muted)" }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div style={{ height: "2px", background: "var(--border)" }}>
          <div className="progress-bar" style={{ width: `${progress}%`, background: meta.color }} />
        </div>
      </header>

      {/* ── CARD ── */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "6px",
            padding: "10px 14px", marginBottom: "1rem",
            fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.06em", color: "#DC2626",
          }}>
            {error}
          </div>
        )}

        <div
          key={step}
          className={dir === "f" ? "animate-step-enter" : "animate-step-back"}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "clamp(1.25rem, 4vw, 2rem)",
            boxShadow: "var(--shadow-sm)",
          }}
        >

          {/* ══ STEP 1: SECTOR ══ */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <StepHeader step={1} total={STEPS.length} color={meta.color}
                title="What kind of business?"
                desc="Choose your sector. Fields, sections, and layouts will adapt to what your business actually needs."
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border)", border: "1px solid var(--border)" }}>
                {(Object.keys(SECTOR_META) as Sector[]).map((s) => {
                  const m = SECTOR_META[s];
                  const selected = sector === s;
                  return (
                    <button
                      key={s} type="button" id={`sector-${s}`}
                      onClick={() => setSector(s)}
                      style={{
                        background: selected ? `${m.color}08` : "var(--surface)",
                        padding: "1.25rem",
                        textAlign: "left", cursor: "pointer", border: "none",
                        borderLeft: selected ? `3px solid ${m.color}` : "3px solid transparent",
                        transition: "background 0.15s ease",
                        outline: "none",
                      }}
                      onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-high)"; }}
                      onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = "var(--surface)"; }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <span className="badge" style={{ color: m.color, background: `${m.color}12`, borderColor: `${m.color}30` }}>
                          {m.tag}
                        </span>
                      </div>
                      <div style={{ fontFamily: "var(--font-instrument-serif)", fontSize: "1.05rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: "4px" }}>
                        {m.label}
                      </div>
                      <div style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
                        {m.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              <NavRow onNext={goNext} isFirst />
            </div>
          )}

          {/* ══ STEP 2: BRAND ══ */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <StepHeader step={2} total={STEPS.length} color={meta.color}
                title="Brand Identity"
                desc="Business name, tagline, description, logo, and sector sub-type."
              />

              <Field label="Business Name" required>
                <input id="brand-name" className="input-field"
                  placeholder={sector === "restaurant" ? "e.g. The Indigo Table" : sector === "salon" ? "e.g. Luxe Hair Studio" : sector === "local_services" ? "e.g. Kumar Electricals" : "e.g. Sunrise Bookstore"}
                  value={name} onChange={(e) => setName(e.target.value)} />
              </Field>

              <Field label="Tagline" ai={
                <AIEnhanceButton fieldName="tagline" currentValue={tagline} category={sector} color={meta.color}
                  context={{ name, description }} onEnhanced={setTagline} />
              }>
                <input id="brand-tagline" className="input-field"
                  placeholder={sector === "restaurant" ? "Authentic flavours, every plate" : sector === "salon" ? "Where beauty meets precision" : sector === "local_services" ? "Trusted repairs, on time" : "Your one-stop destination"}
                  value={tagline} onChange={(e) => setTagline(e.target.value)} />
                <Hint>Shown as the hero subtitle. Keep it under 10 words.</Hint>
              </Field>

              <Field label="About Your Business" ai={
                <AIEnhanceButton fieldName="description" currentValue={description} category={sector} color={meta.color}
                  context={{ name, tagline }} onEnhanced={setDescription} />
              }>
                <textarea id="brand-desc" className="input-field"
                  placeholder="Describe what makes your business unique — your story, specialties, and what customers love about you."
                  value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ resize: "vertical" }} />
              </Field>

              <SectionRule label="Sector Details" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Field label={meta.subTypeLabel}>
                  <select id="brand-subtype" className="input-field" value={subType} onChange={(e) => setSubType(e.target.value)}>
                    <option value="">Select type</option>
                    {meta.subTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Years in Business">
                  <input id="brand-years" className="input-field" placeholder="e.g. 5 or Est. 2019"
                    value={yearsInBusiness} onChange={(e) => setYearsInBusiness(e.target.value)} />
                </Field>
              </div>

              {subType === "" && (
                <Field label={`Custom ${meta.subTypeLabel}`}>
                  <input id="brand-subtype-custom" className="input-field" placeholder={meta.subTypePlaceholder}
                    onChange={(e) => setSubType(e.target.value)} />
                </Field>
              )}

              {/* Advanced Sector Fields */}
              <SectionRule label="Advanced Brand Details" />
              
              {sector === "restaurant" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <Field label="Price Range">
                      <select className="input-field" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                        <option value="">Select price range</option>
                        <option value="$">Budget ($)</option>
                        <option value="$$">Moderate ($$)</option>
                        <option value="$$$">Premium ($$$)</option>
                        <option value="$$$$">Fine Dining ($$$$)</option>
                      </select>
                    </Field>
                    <Field label="Reservation Policy">
                      <input className="input-field" placeholder="e.g. Recommended, Walk-ins only" value={reservationPolicy} onChange={(e) => setReservationPolicy(e.target.value)} />
                    </Field>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <Field label="Dress Code">
                      <input className="input-field" placeholder="e.g. Smart Casual, Formal" value={dressCode} onChange={(e) => setDressCode(e.target.value)} />
                    </Field>
                    <Field label="Ambience / Vibe">
                      <input className="input-field" placeholder="e.g. Intimate, Lively, Family Friendly" value={ambience} onChange={(e) => setAmbience(e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Dietary Options" ai={
                    <AIEnhanceButton fieldName="dietary_options" currentValue={dietaryOptions} category={sector} color={meta.color}
                      context={{ name, description }} onEnhanced={setDietaryOptions} />
                  }>
                    <input className="input-field" placeholder="e.g. Vegan Options, Gluten-Free, Halal" value={dietaryOptions} onChange={(e) => setDietaryOptions(e.target.value)} />
                  </Field>
                </>
              )}

              {sector === "salon" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <Field label="Price Range">
                      <select className="input-field" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                        <option value="">Select price range</option>
                        <option value="$">Affordable ($)</option>
                        <option value="$$">Moderate ($$)</option>
                        <option value="$$$">Luxury ($$$)</option>
                      </select>
                    </Field>
                    <Field label="Reservation Policy">
                      <input className="input-field" placeholder="e.g. By Appointment, Walk-ins welcome" value={reservationPolicy} onChange={(e) => setReservationPolicy(e.target.value)} />
                    </Field>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <Field label="Specialties" ai={
                      <AIEnhanceButton fieldName="specialties" currentValue={specialties} category={sector} color={meta.color}
                        context={{ name, description }} onEnhanced={setSpecialties} />
                    }>
                      <input className="input-field" placeholder="e.g. Hair Coloring, Bridal Makeup" value={specialties} onChange={(e) => setSpecialties(e.target.value)} />
                    </Field>
                    <Field label="Ambience / Experience">
                      <input className="input-field" placeholder="e.g. Relaxing, Modern Spa, Vintage Barbershop" value={ambience} onChange={(e) => setAmbience(e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Brands Carried / Used" ai={
                    <AIEnhanceButton fieldName="brands_used" currentValue={brandsUsed} category={sector} color={meta.color}
                      context={{ name, description }} onEnhanced={setBrandsUsed} />
                  }>
                    <input className="input-field" placeholder="e.g. Olaplex, Dyson, Kerastase" value={brandsUsed} onChange={(e) => setBrandsUsed(e.target.value)} />
                  </Field>
                </>
              )}

              {(sector === "local_services" || sector === "others") && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <Field label="Pricing Model">
                      <input className="input-field" placeholder="e.g. Flat-rate, Hourly, Free Estimates" value={pricingModel} onChange={(e) => setPricingModel(e.target.value)} />
                    </Field>
                    <Field label="Licensing & Insurance Info">
                      <input className="input-field" placeholder="e.g. Fully Insured, Bonded #1234" value={licensingInfo} onChange={(e) => setLicensingInfo(e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Specialties / Domain Expertise" ai={
                    <AIEnhanceButton fieldName="specialties" currentValue={specialties} category={sector} color={meta.color}
                      context={{ name, description }} onEnhanced={setSpecialties} />
                  }>
                    <input className="input-field" placeholder="e.g. Home Automation, emergency pipe repairs, certified roofing" value={specialties} onChange={(e) => setSpecialties(e.target.value)} />
                  </Field>
                  <Field label="Service Guarantees / Warranty">
                    <input className="input-field" placeholder="e.g. 1 Year Warranty on Parts, 100% Satisfaction Guarantee" value={warrantyInfo} onChange={(e) => setWarrantyInfo(e.target.value)} />
                  </Field>
                </>
              )}

              <SectionRule label="Brand Logo" />

              <div>
                <FieldLabel>Your Business Logo</FieldLabel>
                <Hint>Upload your own brand logo. JPEG or PNG. Displayed in your website header.</Hint>
                <div style={{
                  marginTop: "8px",
                  border: `1px dashed ${logo ? meta.color : "var(--border-strong)"}`,
                  borderRadius: "8px", padding: "16px",
                  background: logo ? `${meta.color}06` : "var(--surface-high)",
                  display: "flex", alignItems: "center", gap: "14px",
                  transition: "border-color 0.15s, background 0.15s",
                }}>
                  {logo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo} alt="Logo" style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "4px", border: "1px solid var(--border)", background: "white", padding: "4px" }} />
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--accent-success)", marginBottom: "4px" }}>Logo uploaded</p>
                        <button type="button" onClick={() => setLogo("")} style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#EF4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer", width: "100%", textAlign: "center" }}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>
                        {logoUploading ? "Uploading..." : "Click to upload logo"}
                      </p>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "var(--text-muted)" }}>PNG, JPG — up to 5 MB</p>
                      <input id="logo-upload" type="file" accept="image/*" className="hidden" disabled={logoUploading} onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>

              <NavRow onNext={goNext} onBack={goBack} />
            </div>
          )}

          {/* ══ STEP 3: CONTACT ══ */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <StepHeader step={3} total={STEPS.length} color={meta.color}
                title="Contact & Location"
                desc={sector === "salon" ? "How customers reach and book you." : sector === "restaurant" ? "How customers find and order from you." : sector === "local_services" ? "How clients contact you and where you operate." : "How your customers get in touch."}
              />

              <SectionRule label="Phone & Messaging" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Field label="Phone Number"><input id="c-phone" className="input-field" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
                <Field label="WhatsApp Number"><input id="c-whatsapp" className="input-field" placeholder="+91 98765 43210" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} /></Field>
              </div>
              <Field label="Email Address"><input id="c-email" className="input-field" type="email" placeholder="hello@yourbusiness.com" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>

              <SectionRule label="Address & Location" />
              <Field label="Physical Address" ai={
                <AIEnhanceButton fieldName="address" currentValue={address} category={sector} color={meta.color}
                  context={{ name, description }} onEnhanced={setAddress} />
              }>
                <textarea id="c-address" className="input-field" placeholder="Shop No. 12, MG Road, Bangalore - 560001" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} style={{ resize: "vertical" }} />
              </Field>
              {sector === "local_services" && (
                <Field label="Service Area / Cities Covered" ai={
                  <AIEnhanceButton fieldName="service_area" currentValue={serviceArea} category={sector} color={meta.color}
                    context={{ name, description, address }} onEnhanced={setServiceArea} />
                }>
                  <input id="c-service-area" className="input-field" placeholder="e.g. Indiranagar, Koramangala, Whitefield" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
                  <Hint>List neighbourhoods or cities you cover.</Hint>
                </Field>
              )}
              <Field label="Google Maps Link">
                <input id="c-maps" className="input-field" placeholder="https://maps.google.com/..." value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} />
                <Hint>Paste the Share link from Google Maps.</Hint>
              </Field>

              <SectionRule label="Advanced Location Details" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Field label="Parking Availability">
                  <input className="input-field" placeholder="e.g. Valet Parking, Free Street Parking" value={parkingInfo} onChange={(e) => setParkingInfo(e.target.value)} />
                </Field>
                <Field label="Accessibility">
                  <input className="input-field" placeholder="e.g. Wheelchair Accessible, Elevators" value={accessibility} onChange={(e) => setAccessibility(e.target.value)} />
                </Field>
              </div>
              <Field label="Business Amenities" ai={
                <AIEnhanceButton fieldName="amenities" currentValue={amenities} category={sector} color={meta.color}
                  context={{ name, description }} onEnhanced={setAmenities} />
              }>
                <input className="input-field" placeholder="e.g. Free Wi-Fi, Coffee & Tea, Child Friendly" value={amenities} onChange={(e) => setAmenities(e.target.value)} />
              </Field>

              <SectionRule label="Online & Social Links" />
              {sector === "restaurant" && (
                <Field label="Online Order Link (Swiggy / Zomato / Own)">
                  <input id="c-order" className="input-field" placeholder="https://swiggy.com/..." value={orderUrl} onChange={(e) => setOrderUrl(e.target.value)} />
                </Field>
              )}
              {sector === "salon" && (
                <Field label="Booking Link (Calendly / Booksy / Own)">
                  <input id="c-booking" className="input-field" placeholder="https://calendly.com/..." value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} />
                </Field>
              )}
              {sector === "others" && (
                <Field label="Website / Portfolio Link">
                  <input id="c-website" className="input-field" placeholder="https://yourwebsite.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                </Field>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Field label="Instagram"><input id="c-ig" className="input-field" placeholder="instagram.com/handle" value={instagram} onChange={(e) => setInstagram(e.target.value)} /></Field>
                <Field label="Facebook"><input id="c-fb" className="input-field" placeholder="facebook.com/page" value={facebook} onChange={(e) => setFacebook(e.target.value)} /></Field>
              </div>

              <NavRow onNext={goNext} onBack={goBack} />
            </div>
          )}

          {/* ══ STEP 4: HOURS ══ */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <StepHeader step={4} total={STEPS.length} color={meta.color}
                title="Operating Hours"
                desc="Set your opening times for each day. Customers will see this on your website."
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "2px", border: "1px solid var(--border)" }}>
                {hours.map((h, i) => (
                  <div key={h.day} style={{
                    display: "grid", gridTemplateColumns: "80px 1fr 16px 1fr 72px",
                    gap: "6px", alignItems: "center",
                    padding: "8px 12px",
                    background: h.closed ? "var(--surface-high)" : "var(--surface)",
                    borderBottom: i < hours.length - 1 ? "1px solid var(--border)" : "none",
                    opacity: h.closed ? 0.55 : 1,
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)" }}>
                      {h.day.slice(0, 3)}
                    </span>
                    <input type="time" className="input-field" value={h.open} disabled={h.closed} style={{ fontSize: "0.8rem", padding: "6px 8px" }}
                      onChange={(e) => { const u = [...hours]; u[i].open = e.target.value; setHours(u); }} />
                    <span style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>–</span>
                    <input type="time" className="input-field" value={h.close} disabled={h.closed} style={{ fontSize: "0.8rem", padding: "6px 8px" }}
                      onChange={(e) => { const u = [...hours]; u[i].close = e.target.value; setHours(u); }} />
                    <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", justifyContent: "flex-end" }}>
                      <input type="checkbox" checked={h.closed} style={{ accentColor: "var(--accent)", cursor: "pointer" }}
                        onChange={(e) => { const u = [...hours]; u[i].closed = e.target.checked; setHours(u); }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>Closed</span>
                    </label>
                  </div>
                ))}
              </div>

              {sector === "local_services" && (
                <>
                  <SectionRule label="Availability" />
                  <Toggle checked={emergencyService} onChange={setEmergencyService} label="Available for emergency / out-of-hours calls" />
                  {emergencyService && (
                    <Field label="Typical Response Time">
                      <input id="h-response" className="input-field" placeholder="e.g. Within 2 hours, Same day" value={responseTime} onChange={(e) => setResponseTime(e.target.value)} />
                    </Field>
                  )}
                </>
              )}
              {sector === "salon" && (
                <>
                  <SectionRule label="Booking Policy" />
                  <Toggle checked={walkInAccepted} onChange={setWalkInAccepted} label="Walk-ins are welcome — no appointment needed" />
                </>
              )}

              <NavRow onNext={goNext} onBack={goBack} />
            </div>
          )}

          {/* ══ STEP 5: OFFERINGS ══ */}
          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <StepHeader step={5} total={STEPS.length} color={meta.color}
                title={sector === "restaurant" ? "Menu Items" : sector === "salon" ? "Services & Pricing" : "Services & Trust"}
                desc={sector === "restaurant" ? "Add signature dishes. Include name, price, description, category, and veg/non-veg flag."
                  : sector === "salon" ? "List services with duration and pricing so customers know exactly what you offer."
                  : "List your services and add testimonials to build trust with prospective clients."}
              />

              {/* BULK PASTE OFFERINGS SECTION */}
              <div style={{ background: "var(--surface-high)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: meta.color }}>
                  Bulk Autofill / Parse with AI
                </span>
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.78rem", color: "var(--text-muted)", margin: "4px 0 10px", lineHeight: 1.5 }}>
                  Paste a raw text list of your menu items or services (e.g. from WhatsApp, a PDF, or a flyer). The AI will extract and structure them instantly below.
                </p>
                <textarea
                  className="input-field"
                  placeholder={
                    sector === "restaurant"
                      ? "e.g.\nClassic Veg Burger - Rs 120\nPaneer Tikka Pizza - Rs 240 (Thin crust, spicy paneer)\nChocolate Lava Cake - Rs 90"
                      : "e.g.\nStandard Haircut - $30 (30 mins)\nPremium Spa Treatment - $120 (1 hour - massage and cleanup)"
                  }
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  rows={4}
                  style={{ resize: "vertical", fontSize: "0.8rem", marginBottom: "10px" }}
                />
                <button
                  type="button"
                  disabled={parsingBulk || !bulkText.trim()}
                  onClick={async () => {
                    setParsingBulk(true);
                    setError(null);
                    try {
                      const res = await api.parseOfferings({ raw_text: bulkText, category: sector });
                      if (res.items && res.items.length > 0) {
                        if (sector === "restaurant") {
                          setMenuItems(res.items.map(item => ({
                            name: item.name || "",
                            price: item.price || "",
                            description: item.description || "",
                            category: item.category || "Mains",
                            is_veg: item.is_veg !== undefined ? item.is_veg : null
                          })));
                        } else if (sector === "salon") {
                          setSalonSvcs(res.items.map(item => ({
                            name: item.name || "",
                            price: item.price || "",
                            duration: item.duration || "",
                            description: item.description || "",
                            category: item.category || "Hair"
                          })));
                        } else {
                          setLocalSvcs(res.items.map(item => ({
                            name: item.name || "",
                            price: item.price || "",
                            duration: item.duration || "",
                            description: item.description || "",
                            category: item.category || ""
                          })));
                        }
                        setBulkText("");
                      } else {
                        setError("Could not parse any offerings. Please check your text format.");
                      }
                    } catch (err) {
                      setError("AI Parsing failed. Try again.");
                    } finally {
                      setParsingBulk(false);
                    }
                  }}
                  className="btn-base btn-primary"
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.75rem",
                    width: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {parsingBulk ? (
                    <>
                      <span style={{ width: "12px", height: "12px", border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      Parsing offerings...
                    </>
                  ) : (
                    "✨ AI Parse & Load"
                  )}
                </button>
              </div>

              {sector === "restaurant" && (
                <div style={{ background: "var(--surface-high)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: meta.color }}>
                    Or Upload Menu Card Image
                  </span>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.78rem", color: "var(--text-muted)", margin: "4px 0 10px" }}>
                    Have a menu card photo? Upload it directly so customers can view it on your website.
                  </p>
                  
                  <div style={{
                    border: `1px dashed ${menuImageUrl ? meta.color : "var(--border-strong)"}`,
                    borderRadius: "8px", padding: "16px",
                    background: menuImageUrl ? `${meta.color}06` : "var(--surface)",
                    display: "flex", alignItems: "center", gap: "14px",
                    transition: "border-color 0.15s, background 0.15s",
                  }}>
                    {menuImageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={menuImageUrl} alt="Menu card preview" style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "4px", border: "1px solid var(--border)", background: "white", padding: "4px" }} />
                        <div>
                          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--accent-success)", marginBottom: "4px" }}>Menu Card uploaded</p>
                          <button type="button" onClick={() => setMenuImageUrl("")} style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#EF4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer", width: "100%", textAlign: "center" }}>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>
                          {menuImageUploading ? "Uploading..." : "Upload Menu Card Image"}
                        </p>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "var(--text-muted)" }}>PNG, JPG — up to 5 MB</p>
                        <input
                          id="menu-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={menuImageUploading}
                          onChange={async (e) => {
                            if (!e.target.files?.[0]) return;
                            setMenuImageUploading(true);
                            setError(null);
                            try {
                              const { url } = await api.uploadImage(e.target.files[0]);
                              setMenuImageUrl(url);
                            } catch {
                              setError("Menu image upload failed");
                            } finally {
                              setMenuImageUploading(false);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* RESTAURANT */}
              {sector === "restaurant" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {menuItems.map((item, idx) => (
                    <div key={idx} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "14px", background: "var(--surface-high)", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Item #{idx + 1}</span>
                        {menuItems.length > 1 && <button type="button" onClick={() => setMenuItems(menuItems.filter((_, i) => i !== idx))} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "8px" }}>
                        <input className="input-field" placeholder="Dish name *" value={item.name} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...menuItems]; u[idx].name = e.target.value; setMenuItems(u); }} />
                        <input className="input-field" placeholder="Price" value={item.price} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...menuItems]; u[idx].price = e.target.value; setMenuItems(u); }} />
                      </div>
                      <input className="input-field" placeholder="Description (ingredients, size, allergens)" value={item.description} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...menuItems]; u[idx].description = e.target.value; setMenuItems(u); }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <select className="input-field" value={item.category} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...menuItems]; u[idx].category = e.target.value; setMenuItems(u); }}>
                          {["Starters", "Mains", "Sides", "Desserts", "Drinks", "Specials", "Combos"].map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <select className="input-field" value={item.is_veg === null ? "" : item.is_veg ? "veg" : "nonveg"} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...menuItems]; u[idx].is_veg = e.target.value === "" ? null : e.target.value === "veg"; setMenuItems(u); }}>
                          <option value="">Veg / Non-veg</option>
                          <option value="veg">Vegetarian</option>
                          <option value="nonveg">Non-vegetarian</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  <AddRowButton label="+ Add menu item" color={meta.color} onClick={() => setMenuItems([...menuItems, { name: "", price: "", description: "", category: "Mains", is_veg: null }])} />
                </div>
              )}

              {/* SALON */}
              {sector === "salon" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {salonSvcs.map((item, idx) => (
                    <div key={idx} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "14px", background: "var(--surface-high)", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Service #{idx + 1}</span>
                        {salonSvcs.length > 1 && <button type="button" onClick={() => setSalonSvcs(salonSvcs.filter((_, i) => i !== idx))} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "8px" }}>
                        <input className="input-field" placeholder="Service name *" value={item.name} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...salonSvcs]; u[idx].name = e.target.value; setSalonSvcs(u); }} />
                        <input className="input-field" placeholder="Price" value={item.price} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...salonSvcs]; u[idx].price = e.target.value; setSalonSvcs(u); }} />
                        <input className="input-field" placeholder="Duration" value={item.duration} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...salonSvcs]; u[idx].duration = e.target.value; setSalonSvcs(u); }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8px" }}>
                        <select className="input-field" value={item.category} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...salonSvcs]; u[idx].category = e.target.value; setSalonSvcs(u); }}>
                          {["Hair", "Skin", "Nails", "Body", "Bridal", "Beard & Shave", "Waxing", "Facial"].map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <input className="input-field" placeholder="Short description" value={item.description} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...salonSvcs]; u[idx].description = e.target.value; setSalonSvcs(u); }} />
                      </div>
                    </div>
                  ))}
                  <AddRowButton label="+ Add service" color={meta.color} onClick={() => setSalonSvcs([...salonSvcs, { name: "", price: "", duration: "", description: "", category: "Hair" }])} />

                  <SectionRule label="Team Members (optional)" />
                  {teamMembers.map((m, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: "8px", alignItems: "center" }}>
                      <input className="input-field" placeholder="Name" value={m.name} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...teamMembers]; u[idx].name = e.target.value; setTeamMembers(u); }} />
                      <input className="input-field" placeholder="Role (e.g. Senior Stylist)" value={m.role} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...teamMembers]; u[idx].role = e.target.value; setTeamMembers(u); }} />
                      {teamMembers.length > 1 && <button type="button" onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "1rem", padding: 0 }}>×</button>}
                    </div>
                  ))}
                  <AddRowButton label="+ Add team member" color={meta.color} onClick={() => setTeamMembers([...teamMembers, { name: "", role: "" }])} />
                </div>
              )}

              {/* LOCAL SERVICES + OTHERS */}
              {(sector === "local_services" || sector === "others") && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {localSvcs.map((item, idx) => (
                    <div key={idx} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "14px", background: "var(--surface-high)", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
                          {sector === "others" ? "Offering" : "Service"} #{idx + 1}
                        </span>
                        {localSvcs.length > 1 && <button type="button" onClick={() => setLocalSvcs(localSvcs.filter((_, i) => i !== idx))} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "8px" }}>
                        <input className="input-field" placeholder={sector === "others" ? "Product / service name" : "Service name *"} value={item.name} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...localSvcs]; u[idx].name = e.target.value; setLocalSvcs(u); }} />
                        <input className="input-field" placeholder="Price (optional)" value={item.price} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...localSvcs]; u[idx].price = e.target.value; setLocalSvcs(u); }} />
                      </div>
                      <input className="input-field" placeholder="Description of what's included" value={item.description} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...localSvcs]; u[idx].description = e.target.value; setLocalSvcs(u); }} />
                    </div>
                  ))}
                  <AddRowButton label={`+ Add ${sector === "others" ? "offering" : "service"}`} color={meta.color} onClick={() => setLocalSvcs([...localSvcs, { name: "", price: "", duration: "", description: "", category: "" }])} />

                  {sector === "local_services" && (
                    <>
                      <SectionRule label="Certifications & Credentials (optional)" />
                      <textarea id="o-certs" className="input-field" placeholder="e.g. Licensed Electrician, ISO 9001 Certified, 10+ years experience" value={certifications} onChange={(e) => setCertifications(e.target.value)} rows={2} style={{ resize: "vertical" }} />
                    </>
                  )}

                  <SectionRule label="Customer Testimonials (optional)" />
                  {testimonials.map((t, idx) => (
                    <div key={idx} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "12px", background: "var(--surface)", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <textarea className="input-field" placeholder="What did your customer say?" value={t.quote} style={{ fontSize: "0.85rem", resize: "vertical" }} rows={2} onChange={(e) => { const u = [...testimonials]; u[idx].quote = e.target.value; setTestimonials(u); }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <input className="input-field" placeholder="Customer name" value={t.author} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...testimonials]; u[idx].author = e.target.value; setTestimonials(u); }} />
                        <input className="input-field" placeholder="Their role (optional)" value={t.role} style={{ fontSize: "0.85rem" }} onChange={(e) => { const u = [...testimonials]; u[idx].role = e.target.value; setTestimonials(u); }} />
                      </div>
                      {testimonials.length > 1 && <button type="button" onClick={() => setTestimonials(testimonials.filter((_, i) => i !== idx))} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#EF4444", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>Remove</button>}
                    </div>
                  ))}
                  <AddRowButton label="+ Add testimonial" color={meta.color} onClick={() => setTestimonials([...testimonials, { quote: "", author: "", role: "" }])} />
                </div>
              )}

              <NavRow onNext={goNext} onBack={goBack} />
            </div>
          )}

          {/* ══ STEP 6: VISUALS ══ */}
          {step === 6 && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <StepHeader step={6} total={STEPS.length} color={meta.color}
                title="Visual Assets"
                desc={`Add up to ${MAX_IMAGES} featured photos. Photo 1 → hero · Photo 2 → about section · Photo 3 → CTA panel.`}
              />

              {/* Image grid with Drag and Drop Dropzone */}
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  if (featuredImages.length < MAX_IMAGES) {
                    setIsDragging(true);
                  }
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (featuredImages.length < MAX_IMAGES) {
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageUpload(file);
                  }
                }}
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(3, 1fr)", 
                  gap: "8px",
                  border: isDragging ? `2px dashed ${meta.color}` : "2px dashed transparent",
                  borderRadius: "8px",
                  padding: "4px",
                  transition: "all 0.2s"
                }}
              >
                {featuredImages.map((url, i) => (
                  <div key={url} style={{ position: "relative", aspectRatio: "1", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", padding: "4px 6px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "white" }}>
                        {i === 0 ? "Hero" : i === 1 ? "About" : "CTA"}
                      </span>
                    </div>
                    <button type="button" onClick={() => setFeaturedImages(featuredImages.filter((_, j) => j !== i))}
                      style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.65)", border: "none", color: "white", width: "20px", height: "20px", borderRadius: "50%", cursor: "pointer", fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      ✕
                    </button>
                  </div>
                ))}
                {Array.from({ length: MAX_IMAGES - featuredImages.length }).map((_, i) => (
                  <div key={`e${i}`} style={{ aspectRatio: "1", borderRadius: "6px", border: "1px dashed var(--border-strong)", background: "var(--surface-high)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                      {featuredImages.length + i === 0 ? "Hero" : featuredImages.length + i === 1 ? "About" : "CTA"}
                    </span>
                  </div>
                ))}
              </div>

              {featuredImages.length < MAX_IMAGES && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <label className="btn-base btn-outline" style={{ padding: "8px 16px", cursor: "pointer" }}>
                    {uploading ? "Uploading..." : "Upload photo"}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  </label>
                  <button type="button" onClick={() => setShowStock((v) => !v)} className="btn-base btn-outline" style={{ padding: "8px 16px" }}>
                    {showStock ? "Hide library" : "Browse photo library"}
                  </button>
                </div>
              )}

              {showStock && featuredImages.length < MAX_IMAGES && (
                <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "12px", background: "var(--surface-high)" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "10px" }}>
                    Curated {sector.replace("_", " ")} photos
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
                    {stockImages.map((img) => {
                      const selected = featuredImages.includes(img.url);
                      return (
                        <button key={img.id} type="button"
                          onClick={() => { if (selected) setFeaturedImages(featuredImages.filter((u) => u !== img.url)); else if (featuredImages.length < MAX_IMAGES) setFeaturedImages([...featuredImages, img.url]); }}
                          style={{ aspectRatio: "1", borderRadius: "4px", overflow: "hidden", border: `2px solid ${selected ? meta.color : "transparent"}`, cursor: "pointer", position: "relative", padding: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {selected && <div style={{ position: "absolute", inset: 0, background: `${meta.color}40`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.9rem" }}>✓</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ background: "var(--surface-high)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                  Photo placement — Photo 1: hero background · Photo 2: about section · Photo 3: CTA panel
                </span>
              </div>

              <NavRow onBack={goBack} isLast loading={loading} />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
