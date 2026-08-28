"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { StyleOption, Category, Palette, FontPairing } from "@/lib/types";

// Section 4, "Important UX Rule": owners see visual style cards, never internal labels like
// "Modern" or "Premium" as engineering terms — those internal template ids stay in templateId only.
const STYLE_OPTIONS: Record<Category, StyleOption[]> = {
  restaurant: [
    { templateId: "restaurant-premium", displayLabel: "Elegant",         imageUrl: "/style-previews/restaurant-premium.jpg" },
    { templateId: "restaurant-modern",  displayLabel: "Warm & Inviting", imageUrl: "/style-previews/restaurant-modern.jpg"  },
    { templateId: "restaurant-local",   displayLabel: "Bold & Modern",   imageUrl: "/style-previews/restaurant-local.jpg"   },
  ],
  salon: [
    { templateId: "salon-luxury",  displayLabel: "Luxe",           imageUrl: "/style-previews/salon-luxury.jpg"  },
    { templateId: "salon-modern",  displayLabel: "Fresh & Modern", imageUrl: "/style-previews/salon-modern.jpg"  },
    { templateId: "salon-minimal", displayLabel: "Clean & Simple", imageUrl: "/style-previews/salon-minimal.jpg" },
  ],
  local_services: [
    { templateId: "services-professional", displayLabel: "Professional",       imageUrl: "/style-previews/services-pro.jpg"   },
    { templateId: "services-bold",         displayLabel: "Bold & Trustworthy", imageUrl: "/style-previews/services-bold.jpg"  },
    { templateId: "services-local",        displayLabel: "Simple & Local",     imageUrl: "/style-previews/services-local.jpg" },
  ],
};


export default function StylePickerPage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>("restaurant");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [fonts, setFonts] = useState<FontPairing[]>([]);
  const [paletteId, setPaletteId] = useState<string | null>(null); // null = let AI pick
  const [fontId, setFontId] = useState<string | null>(null);       // null = let AI pick
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedCategory = sessionStorage.getItem("devframes_category") as Category | null;
    const storedId = sessionStorage.getItem("devframes_business_id");
    if (storedCategory) setCategory(storedCategory);
    setBusinessId(storedId);
    api.listPalettes().then((res) => setPalettes(res.palettes)).catch(() => {});
    api.listFonts().then((res) => setFonts(res.fonts)).catch(() => {});
  }, []);

  async function handleConfirm() {
    if (selected === null || !businessId) return;
    setLoading(true);
    setError(null);
    try {
      const option = STYLE_OPTIONS[category][selected];
      const site = await api.createWebsite({
        business_id: businessId,
        template: option.templateId,
        style_choice_image_id: option.imageUrl,
        palette_id: paletteId ?? undefined,
        font_id: fontId ?? undefined,
      });
      router.push(`/preview/${(site as { slug: string }).slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate your site");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="bg-bg-secondary border border-border-card rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-serif text-text-primary mb-2">
          Which style do you like?
        </h1>
        <p className="text-sm text-text-secondary mb-8 leading-relaxed font-sans">
          Just tap the one that feels right — you can change it later.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-10">
          {STYLE_OPTIONS[category].map((opt, i) => (
            <button
              key={opt.displayLabel}
              onClick={() => setSelected(i)}
              className={`rounded-lg overflow-hidden border-2 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                selected === i ? "border-accent ring-2 ring-accent/30" : "border-border"
              }`}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-bg-subtle to-border flex items-end p-3">
                <div className="w-6 h-6 rounded-none bg-white shadow-sm border border-border flex items-center justify-center text-[10px] text-text-secondary font-mono font-bold">
                  {i + 1}
                </div>
              </div>
              <p className="text-center text-sm font-bold text-text-primary py-3 bg-bg-elevated border-t border-border font-sans">
                {opt.displayLabel}
              </p>
            </button>
          ))}
        </div>

        {/* Marketplace: color palette — optional */}
        <div className="mb-8 border-t border-border pt-6">
          <h2 className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-2">
            Color palette
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed font-sans">
            Optional — leave unset and we will pick colors that suit your business.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPaletteId(null)}
              className={`btn-base text-xs rounded-md px-4 py-2 transition-all duration-150 ${
                paletteId === null
                  ? "btn-primary border border-accent"
                  : "btn-outline border border-border"
              }`}
            >
              Auto (AI-picked)
            </button>
            {palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => setPaletteId(p.id)}
                className={`btn-base text-xs rounded-md px-4 py-2 flex items-center gap-2.5 transition-all duration-150 ${
                  paletteId === p.id
                    ? "btn-primary border border-accent"
                    : "btn-outline border border-border"
                }`}
              >
                <span className="flex gap-0.5">
                  <span className="w-3 h-3 rounded-full border border-bg-secondary shadow-sm" style={{ background: p.primary }} />
                  <span className="w-3 h-3 rounded-full border border-bg-secondary shadow-sm" style={{ background: p.secondary }} />
                  <span className="w-3 h-3 rounded-full border border-bg-secondary shadow-sm" style={{ background: p.accent }} />
                </span>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Marketplace: font pairing — optional */}
        <div className="mb-10 border-t border-border pt-6">
          <h2 className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-2">
            Font pairing
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed font-sans">
            Optional — leave unset and we will pick a font that suits your business.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFontId(null)}
              className={`btn-base text-xs rounded-md px-4 py-2 transition-all duration-150 ${
                fontId === null
                  ? "btn-primary border border-accent"
                  : "btn-outline border border-border"
              }`}
            >
              Auto (AI-picked)
            </button>
            {fonts.map((f) => (
              <button
                key={f.id}
                onClick={() => setFontId(f.id)}
                className={`btn-base text-xs rounded-md px-4 py-2 text-left transition-all duration-150 ${
                  fontId === f.id
                    ? "btn-primary border border-accent"
                    : "btn-outline border border-border"
                }`}
              >
                <div>{f.name}</div>
                <span className="block text-[9px] text-text-muted font-mono tracking-normal mt-0.5 lowercase">
                  {f.heading_font} + {f.body_font}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-critical-bg text-critical border border-critical-border rounded-md p-3 text-xs font-mono uppercase tracking-wide mb-6">
            {error}
          </div>
        )}

        <button
          disabled={selected === null || loading}
          onClick={handleConfirm}
          className="w-full btn-base btn-primary py-4 text-xs tracking-wider shadow-md"
        >
          {loading ? "Generating your website..." : "Generate my website"}
        </button>
      </div>
    </main>
  );
}
