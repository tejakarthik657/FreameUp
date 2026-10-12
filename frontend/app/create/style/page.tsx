"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { StyleOption, Category, Palette, FontPairing } from "@/lib/types";
import { Sparkles, Palette as PaletteIcon, Type, Check, ArrowRight, ShieldCheck } from "lucide-react";

const STYLE_OPTIONS: Record<Category | "others", StyleOption[]> = {
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
  others: [
    { templateId: "services-professional", displayLabel: "Professional",       imageUrl: "/style-previews/services-pro.jpg"   },
    { templateId: "services-bold",         displayLabel: "Bold & Trustworthy", imageUrl: "/style-previews/services-bold.jpg"  },
    { templateId: "services-local",        displayLabel: "Simple & Local",     imageUrl: "/style-previews/services-local.jpg" },
  ],
};

export default function StylePickerPage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | "others">("restaurant");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(0);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [fonts, setFonts] = useState<FontPairing[]>([]);
  const [paletteId, setPaletteId] = useState<string | null>(null);
  const [fontId, setFontId] = useState<string | null>(null);
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
    <main className="min-h-screen bg-[#f5f5f7] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#e0e0e0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0066cc]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#0066cc] font-semibold">
                Step 2: Aesthetic & Brand Direction
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Choose Your Design Identity
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b]">
              Select the visual style that matches your business. Every template is mobile-responsive and tailored with live content.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] rounded-full border border-[#e0e0e0] font-semibold self-start sm:self-auto capitalize">
            Sector: {category.replace("_", " ")}
          </span>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-[20px] border border-[#e0e0e0] p-6 sm:p-8 shadow-xs space-y-8">
          
          {/* Style Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0066cc]" />
                Template Styles
              </h2>
              <span className="text-xs text-[#86868b]">Tap to select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {STYLE_OPTIONS[category].map((opt, i) => {
                const isSelected = selected === i;
                return (
                  <button
                    key={opt.displayLabel}
                    type="button"
                    onClick={() => setSelected(i)}
                    className={`rounded-2xl overflow-hidden border text-left transition-all p-4 flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "border-[#0066cc] bg-blue-50/20 shadow-xs ring-2 ring-[#0066cc]/20"
                        : "border-[#e0e0e0] bg-[#f5f5f7] hover:border-neutral-300"
                    }`}
                  >
                    <div className="aspect-[16/10] bg-white rounded-xl border border-[#e0e0e0] flex items-center justify-center p-3 relative overflow-hidden">
                      <div className="text-center space-y-1">
                        <span className="w-8 h-8 rounded-full bg-[#f5f5f7] text-[#0066cc] border border-[#e0e0e0] flex items-center justify-center mx-auto text-xs font-bold font-mono">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-[#1d1d1f] block">
                          {opt.displayLabel}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#0066cc] text-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-[#1d1d1f]">
                        {opt.displayLabel}
                      </span>
                      <span className="text-[11px] font-mono text-[#86868b]">
                        {isSelected ? "Selected" : "Select"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette Section */}
          <div className="pt-6 border-t border-[#e0e0e0] space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                <PaletteIcon className="w-4 h-4 text-[#0066cc]" />
                Brand Color Palette
              </h3>
              <p className="text-xs text-[#86868b] mt-0.5">
                Leave on Auto to let the AI harmonize colors with your sector, or select a palette below.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setPaletteId(null)}
                className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${
                  paletteId === null
                    ? "bg-[#0066cc] text-white shadow-xs"
                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] border border-[#e0e0e0]"
                }`}
              >
                Auto (AI Recommended)
              </button>

              {palettes.map((p) => {
                const isSelected = paletteId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaletteId(p.id)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-medium flex items-center gap-2 transition-all border ${
                      isSelected
                        ? "bg-[#0066cc] text-white border-[#0066cc] shadow-xs"
                        : "bg-[#f5f5f7] text-[#1d1d1f] border-[#e0e0e0] hover:bg-[#e8e8ed]"
                    }`}
                  >
                    <span className="flex gap-0.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.primary }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.secondary }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.accent }} />
                    </span>
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Section */}
          <div className="pt-6 border-t border-[#e0e0e0] space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                <Type className="w-4 h-4 text-[#0066cc]" />
                Typography & Font Pairing
              </h3>
              <p className="text-xs text-[#86868b] mt-0.5">
                Choose the font tone for your headings and body text.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setFontId(null)}
                className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${
                  fontId === null
                    ? "bg-[#0066cc] text-white shadow-xs"
                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] border border-[#e0e0e0]"
                }`}
              >
                Auto (AI Harmonized)
              </button>

              {fonts.map((f) => {
                const isSelected = fontId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontId(f.id)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all border ${
                      isSelected
                        ? "bg-[#0066cc] text-white border-[#0066cc] shadow-xs"
                        : "bg-[#f5f5f7] text-[#1d1d1f] border-[#e0e0e0] hover:bg-[#e8e8ed]"
                    }`}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Submission Bar */}
          <div className="pt-6 border-t border-[#e0e0e0] flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="apple-btn-secondary text-xs px-5 py-2.5 font-medium"
            >
              Back to Business Details
            </button>

            <button
              type="button"
              disabled={selected === null || loading}
              onClick={handleConfirm}
              className="apple-btn-primary text-xs px-6 py-2.5 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Site...
                </>
              ) : (
                <>
                  Generate Website Live
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
