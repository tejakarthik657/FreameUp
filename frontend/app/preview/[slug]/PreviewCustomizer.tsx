"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getTemplate } from "@/templates/registry";
import "@/templates"; // Ensure client-side template registration runs!
import type { Business, RenderManifest, Palette, FontPairing } from "@/lib/types";
import { QrCode, ExternalLink, Sparkles, RefreshCw, Layers, Check, Loader2, ArrowUpRight } from "lucide-react";

interface CustomizerProps {
  siteId: string;
  initialBusiness: Business;
  initialManifest: RenderManifest;
  slug: string;
  publishedUrl: string;
  qrUrl: string;
  isExport?: boolean;
}

export default function PreviewCustomizer({
  siteId,
  initialBusiness,
  initialManifest,
  slug,
  publishedUrl,
  qrUrl,
  isExport = false,
}: CustomizerProps) {
  const [business, setBusiness] = useState<Business>(initialBusiness);
  const [manifest, setManifest] = useState<RenderManifest>(initialManifest);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [fonts, setFonts] = useState<FontPairing[]>([]);
  
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staticSuccess, setStaticSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listPalettes().then((res) => setPalettes(res.palettes)).catch(() => {});
    api.listFonts().then((res) => setFonts(res.fonts)).catch(() => {});
  }, []);

  const TemplateComponent = getTemplate(manifest.template_id);

  async function handleRegenerate(scope: "theme" | "content" | "full" | "palette" | "font", paletteId?: string, fontId?: string) {
    setLoading(true);
    setError(null);
    setStaticSuccess(null);
    try {
      const payload: { scope: string; palette_id?: string; font_id?: string } = { scope };
      if (scope === "palette") payload.palette_id = paletteId;
      if (scope === "font") payload.font_id = fontId;

      await api.regenerateSite(siteId, payload);
      // Fetch latest site data to sync completely
      const fresh = await api.getSiteData(slug);
      setBusiness(fresh.business);
      setManifest(fresh.manifest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update style");
    } finally {
      setLoading(false);
    }
  }

  async function handleStaticExport() {
    setLoading(true);
    setError(null);
    setStaticSuccess(null);
    try {
      const res = await api.generateStatic(siteId);
      if (res.ok) {
        setStaticSuccess(`Static site exported! Size: ${(res.bytes / 1024).toFixed(1)} KB`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Static generation failed");
    } finally {
      setLoading(false);
    }
  }

  if (isExport) {
    return (
      <div className="min-h-screen relative pb-16">
        {TemplateComponent ? (
          <TemplateComponent business={business} manifest={manifest} />
        ) : (
          <div className="p-20 text-center text-gray-500 font-sans">
            Template &quot;{manifest.template_id}&quot; not found or registered.
          </div>
        )}
        
        {/* Subtle, Floating Brand Watermark for Exported/Static sites */}
        <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-md text-[10px] font-semibold font-sans text-gray-600 select-none z-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="DevFrames Logo" className="w-4 h-4 rounded-full object-cover" />
          <span>Developed by <a href="https://devframes.vercel.app" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-bold">DevFrames</a></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {/* Sleek, Mature Vercel/Figma style Customizer Bar */}
      <header className="bg-white border-b border-[#EAEAE8] sticky top-0 z-50 px-6 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-sans antialiased shadow-xs">
        
        {/* Left Side: Brand & Live Links */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                Preview Mode
              </span>
              <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
                {business.name}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs mt-1">
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-gray-900 flex items-center gap-1 font-medium transition-colors"
              >
                <span>{publishedUrl}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setShowQR(!showQR)}
                className="text-gray-500 hover:text-gray-900 flex items-center gap-1 font-medium transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Show QR Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Mature Selectors & Controls */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Palette Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Palette</span>
            <div className="relative">
              <select
                disabled={loading}
                value={manifest.theme.primary}
                onChange={(e) => {
                  const p = palettes.find((x) => x.primary === e.target.value);
                  if (p) handleRegenerate("palette", p.id);
                }}
                className="border border-[#E2E2DF] hover:border-gray-400 rounded-md pl-3 pr-8 py-1.5 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all cursor-pointer appearance-none min-w-[140px]"
              >
                <option value="">AI Custom</option>
                {palettes.map((p) => (
                  <option key={p.id} value={p.primary}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Layers className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Font Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Font</span>
            <div className="relative">
              <select
                disabled={loading}
                value={manifest.theme.heading_font || manifest.theme.font}
                onChange={(e) => {
                  const f = fonts.find((x) => x.heading_font === e.target.value);
                  if (f) handleRegenerate("font", undefined, f.id);
                }}
                className="border border-[#E2E2DF] hover:border-gray-400 rounded-md pl-3 pr-8 py-1.5 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all cursor-pointer appearance-none min-w-[140px]"
              >
                <option value="">AI Custom</option>
                {fonts.map((f) => (
                  <option key={f.id} value={f.heading_font}>
                    {f.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <RefreshCw className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-200" />

          {/* AI Content Regenerator */}
          <div className="flex items-center gap-2">
            <button
              disabled={loading}
              onClick={() => handleRegenerate("content")}
              className="flex items-center gap-1.5 text-xs font-semibold border border-[#E2E2DF] hover:border-gray-400 px-3.5 py-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Regenerate Copy</span>
            </button>
            
            <button
              disabled={loading}
              onClick={handleStaticExport}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.75 rounded-md bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 shadow-sm transition-all"
            >
              <span>Publish Static HTML</span>
            </button>
          </div>
        </div>

      </header>

      {/* Sleek Minimalist Modal for QR Code */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50" onClick={() => setShowQR(false)}>
          <div className="bg-white border border-[#EAEAE8] p-8 rounded-xl shadow-2xl max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">Scan QR Code</h2>
            <p className="text-xs text-gray-500 mt-1 mb-6 leading-relaxed">Point your device camera at the code below to instantly preview the live site.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="Website QR Code" className="w-48 h-48 mx-auto bg-white p-1.5 border border-[#E2E2DF] rounded-lg" />
            <button
              onClick={() => setShowQR(false)}
              className="mt-6 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-[#E2E2DF] px-4 py-2 rounded-md hover:bg-gray-50 transition-colors w-full"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Toast Alert Banner for Static Export */}
      {staticSuccess && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2.5 text-center font-semibold tracking-wide">
          {staticSuccess}
        </div>
      )}
      {error && (
        <div className="bg-red-600 text-white text-xs px-4 py-2.5 text-center font-semibold tracking-wide">
          Error: {error}
        </div>
      )}

      {/* Renders the Custom Template */}
      <div className="flex-1">
        {TemplateComponent ? (
          <TemplateComponent business={business} manifest={manifest} />
        ) : (
          <div className="p-20 text-center text-gray-500 font-sans">
            Template &quot;{manifest.template_id}&quot; not found or registered.
          </div>
        )}
      </div>
    </div>
  );
}
