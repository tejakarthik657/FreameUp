"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getTemplate } from "@/templates/registry";
import "@/templates"; // Ensure client-side template registration runs!
import type { Business, RenderManifest, Palette, FontPairing } from "@/lib/types";
import { useRouter } from "next/navigation";
import { QrCode, ExternalLink, Sparkles, RefreshCw, Layers, Check, Loader2, ArrowUpRight, Monitor, Tablet, Smartphone, ArrowLeft, Pencil } from "lucide-react";
import { ThemeStyle } from "@/templates/_shared/ui/ThemeStyle";

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
  const router = useRouter();
  const [business, setBusiness] = useState<Business>(initialBusiness);
  const [manifest, setManifest] = useState<RenderManifest>(initialManifest);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [fonts, setFonts] = useState<FontPairing[]>([]);
  
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staticSuccess, setStaticSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [controlsExpanded, setControlsExpanded] = useState(false);

  const handleDownloadQR = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(qrUrl, "_blank");
    }
  };

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

  const hostnameParts = typeof window !== "undefined" ? window.location.hostname.split(".") : [];
  const hostIsSubdomain = hostnameParts.length > 0 && hostnameParts[0] === slug;
  const isPublic = isExport || hostIsSubdomain;

  if (isPublic) {
    return (
      <div className="min-h-screen relative pb-16">
        <ThemeStyle theme={manifest.theme} />
        {TemplateComponent ? (
          <TemplateComponent business={business} manifest={manifest} />
        ) : (
          <div className="p-20 text-center text-gray-500 font-sans">
            Template &quot;{manifest.template_id}&quot; not found or registered.
          </div>
        )}
        
        {/* Minimal, Floating Brand Watermark Badge */}
        <div className="fixed bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-xs border border-gray-200/40 rounded-full shadow-xs text-[9px] font-sans text-gray-400 select-none z-50 hover:bg-white hover:text-gray-600 transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="DevFrames Logo" className="w-3.5 h-3.5 rounded-full object-cover opacity-60" />
          <span>Developed by <a href="https://devframes.vercel.app" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-indigo-600 hover:underline font-semibold">DevFrames</a></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {/* Sleek, Mature Vercel/Figma style Customizer Bar */}
      {/* Sleek, Mature Vercel/Figma style Customizer Bar */}
      <header className="bg-white border-b border-[#EAEAE8] sticky top-0 z-50 px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 font-sans antialiased shadow-xs">
        
        {/* Main Row */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          {/* Dashboard Button & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all border border-gray-200 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                  Preview
                </span>
                <h1 className="text-xs font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
                  {business.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <a href={publishedUrl} target="_blank" rel="noreferrer" className="hover:text-gray-900 hover:underline flex items-center gap-0.5">
                  <span>Live Site</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </div>
            </div>
            <button
              onClick={() => router.push(`/workshop/${slug}`)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all border border-gray-200"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit website
            </button>
          </div>

          {/* Right Side: Toggle button on mobile, Viewport Switcher on desktop */}
          <div className="flex items-center gap-2">
            {/* Viewport Switcher (Desktop only) */}
            <div className="hidden lg:flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 shadow-2xs">
              <button
                onClick={() => setViewport("desktop")}
                className={`p-1.5 rounded-md transition-all ${viewport === "desktop" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-400 hover:text-gray-700"}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`p-1.5 rounded-md transition-all ${viewport === "tablet" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-400 hover:text-gray-700"}`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`p-1.5 rounded-md transition-all ${viewport === "mobile" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-400 hover:text-gray-700"}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile QR Button */}
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-2xs lg:hidden"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Mobile Customize Controls Toggle */}
            <button
              onClick={() => setControlsExpanded(!controlsExpanded)}
              className={`flex lg:hidden items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-2xs ${
                controlsExpanded
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{controlsExpanded ? "Close" : "Customize"}</span>
            </button>
          </div>
        </div>

        {/* Collapsible customizer settings: expands on mobile, always visible on large screens */}
        <div className={`${controlsExpanded ? "flex" : "hidden lg:flex"} flex-col lg:flex-row items-stretch lg:items-center justify-end gap-3.5 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 mt-1 lg:mt-0`}>
          {/* Palette Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono shrink-0">Palette</span>
            <div className="relative w-full sm:w-auto">
              <select
                disabled={loading}
                value={manifest.theme.primary}
                onChange={(e) => {
                  const p = palettes.find((x) => x.primary === e.target.value);
                  if (p) handleRegenerate("palette", p.id);
                }}
                className="w-full sm:w-[140px] border border-[#E2E2DF] hover:border-gray-400 rounded-md pl-3 pr-8 py-1.5 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all cursor-pointer appearance-none"
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono shrink-0">Font</span>
            <div className="relative w-full sm:w-auto">
              <select
                disabled={loading}
                value={manifest.theme.heading_font || manifest.theme.font}
                onChange={(e) => {
                  const f = fonts.find((x) => x.heading_font === e.target.value);
                  if (f) handleRegenerate("font", undefined, f.id);
                }}
                className="w-full sm:w-[140px] border border-[#E2E2DF] hover:border-gray-400 rounded-md pl-3 pr-8 py-1.5 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all cursor-pointer appearance-none"
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

          <div className="hidden lg:block w-px h-6 bg-gray-200" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <button
              disabled={loading}
              onClick={() => handleRegenerate("content")}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold border border-[#E2E2DF] hover:border-gray-400 px-3.5 py-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 transition-all w-full sm:w-auto"
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
              className="flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-1.75 rounded-md bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 shadow-sm transition-all w-full sm:w-auto"
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
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDownloadQR}
                className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-md transition-colors w-full"
              >
                Download QR
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 border border-[#E2E2DF] px-4 py-2 rounded-md hover:bg-gray-50 transition-colors w-full"
              >
                Dismiss
              </button>
            </div>
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
      <div className="flex-1 overflow-y-auto p-0 sm:p-4 md:p-8 flex justify-center items-start">
        <ThemeStyle theme={manifest.theme} />
        <div
          className={`transition-all duration-300 w-full ${
            viewport === "desktop"
              ? "max-w-none"
              : viewport === "tablet"
              ? "max-w-[768px] border border-[#EAEAE8] shadow-md bg-white min-h-[800px]"
              : "max-w-[375px] border-[8px] border-gray-900 rounded-[36px] shadow-2xl bg-white overflow-hidden aspect-[9/16] min-h-[660px]"
          }`}
        >
          {TemplateComponent ? (
            <TemplateComponent business={business} manifest={manifest} />
          ) : (
            <div className="p-20 text-center text-gray-500 font-sans">
              Template &quot;{manifest.template_id}&quot; not found or registered.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
