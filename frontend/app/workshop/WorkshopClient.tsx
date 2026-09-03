"use client";

import { Component, ErrorInfo, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Save, ArrowLeft, Layers, Eye, Code2, Search } from "lucide-react";
import { api } from "@/lib/api";
import {
  COMPONENT_LIBRARY,
  getComponentMeta,
  type ComponentMeta,
  type VariantMeta,
} from "@/templates/_library/manifest";
import { resolveVariant, TSX_COMPONENT_IDS } from "@/templates/_library/registry";
import type { VariantProps } from "@/templates/_library/registry";
import type { Business, RenderManifest, SiteDataResponse } from "@/lib/types";

function propsForComponent(componentId: string, business: Business, manifest: RenderManifest): Record<string, unknown> {
  const stored = manifest.sections[componentId]?.data;
  if (stored && Object.keys(stored).length > 0) return stored;

  const image = business.featured_images?.[0];
  const links = [
    { label: "Home", href: "#" },
    ...(business.category === "restaurant" && business.menu?.length ? [{ label: "Menu", href: "#menu" }] : []),
    ...(business.category !== "restaurant" ? [{ label: "Services", href: "#services" }] : []),
    { label: "Contact", href: "#contact" },
  ];
  switch (componentId) {
    case "navbar":
      return { brand: business.name, tagline: business.tagline, links, cta: business.bookingUrl ? { label: "Book now", href: business.bookingUrl } : undefined };
    case "hero":
      return { headline: business.name, description: business.description || business.tagline || "", ctaLabel: business.bookingUrl ? "Book now" : undefined, ctaHref: business.bookingUrl, imageUrl: image };
    case "about":
      return { title: business.name, description: business.description || "", imageUrl: business.featured_images?.[1] };
    case "contact-form":
      return { heading: "Contact", infoHeading: business.name, infoText: [business.address, business.phone, business.email].filter(Boolean).join("\n"), ctaLabel: "Send" };
    case "map-location":
      return { heading: "Find us", address: business.address || "", ctaLabel: business.mapsUrl ? "Get directions" : undefined, ctaHref: business.mapsUrl };
    case "menu-services":
      return { heading: business.category === "restaurant" ? "Menu" : "Services", categories: [{ name: "", items: (business.category === "restaurant" ? business.menu : business.services).map((item) => ({ name: item.name, price: item.price || "" })) }] };
    case "gallery":
      return { heading: "Gallery", images: (business.images?.length ? business.images : business.featured_images || []).map((url) => ({ url })) };
    case "opening-hours":
      return { heading: "Opening hours", rows: (business.hours || []).map((hour) => ({ label: hour.day, value: hour.closed ? "Closed" : [hour.open, hour.close].filter(Boolean).join(" - ") })) };
    case "pricing":
      return { heading: "Services and pricing", tiers: (business.services || []).map((item) => ({ name: item.name, amount: item.price || "", duration: item.duration || "" })) };
    case "team":
      return { heading: "Our team", members: (business.team || []).map((member) => ({ name: member.name, role: member.role, imageUrl: member.image })) };
    case "testimonials":
      return { heading: "What our customers say", items: business.testimonials || [] };
    case "social-links":
      return { heading: "Follow us", links: [business.instagram && { label: "Instagram", href: business.instagram }, business.facebook && { label: "Facebook", href: business.facebook }, business.whatsapp && { label: "WhatsApp", href: `https://wa.me/${business.whatsapp}` }].filter(Boolean) };
    case "footer":
      return { brand: business.name, tagline: business.tagline || business.description, copyright: business.name };
    case "announcement-bar":
      return { message: business.tagline || business.description || "", linkLabel: business.bookingUrl ? "Book now" : "", linkHref: business.bookingUrl || "" };
    case "cta-banner":
      return { heading: business.tagline || business.name, primaryCta: { label: business.bookingUrl ? "Book now" : "Contact us", href: business.bookingUrl || `tel:${business.phone || ""}` }, secondaryCta: business.phone ? { label: business.phone, href: `tel:${business.phone}` } : undefined };
    case "faq":
      return { heading: "Frequently asked questions", items: [] };
    case "features":
      return { heading: business.name, features: [] };
    case "newsletter":
      return { prompt: business.email ? `Contact ${business.email}` : "Stay connected", ctaLabel: "Contact us", heading: business.name };
    case "stats-counters":
      return { stats: business.years_in_business ? [{ value: business.years_in_business, label: "Years in business" }] : [] };
    case "timeline":
      return { heading: business.name, events: business.years_in_business ? [{ year: business.years_in_business, label: "Years in business" }] : [] };
    case "video-section":
      return { heading: business.name, description: business.description || "", imageUrl: image, embedLabel: "" };
    case "blog-teaser":
      return { heading: business.name, description: business.description || "", posts: [] };
    default:
      return {};
  }
}

class PreviewErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Component preview failed", error, info);
  }

  render() {
    if (this.state.error) {
      return <div className="p-8 text-center text-sm text-red-700 bg-red-50">This component cannot render with the current data. Choose another variant or edit its fields.</div>;
    }
    return this.props.children;
  }
}

/** Recursively flatten props into key/value rows for the editor. The values
 *  flow back out via setPropsFromEditor — limited but pragmatic for the v1
 *  workshop; structured editors (link lists, theme tokens) come later. */
type FlatRow = { keyPath: string[]; value: unknown };

function flatten(input: unknown, prefix: string[] = []): FlatRow[] {
  if (input === null || input === undefined) return [];
  if (typeof input !== "object") return [{ keyPath: prefix, value: input }];
  if (Array.isArray(input)) {
    const out: FlatRow[] = [];
    input.forEach((item, i) => {
      out.push(...flatten(item, [...prefix, String(i)]));
    });
    return out;
  }
  const out: FlatRow[] = [];
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    out.push(...flatten(v, [...prefix, k]));
  }
  return out;
}

function setAtPath(target: Record<string, unknown>, path: string[], value: unknown): Record<string, unknown> {
  if (path.length === 0) return value as Record<string, unknown>;
  const [head, ...rest] = path;
  const next = { ...(target as Record<string, unknown>) };
  if (/^\d+$/.test(head) && Array.isArray(next[head as unknown as keyof typeof next])) {
    // arrays handled via numeric indices above; just slot in
    const arr = [...((next[head as unknown as keyof typeof next] as unknown[]) || [])];
    arr[Number(head)] = setAtPath({} as Record<string, unknown>, rest, value) as unknown;
    // simplify: reassign whole
    (next as Record<string, unknown>)[head] = arr;
    return next;
  }
  (next as Record<string, unknown>)[head] = setAtPath(
    ((next as Record<string, unknown>)[head] as Record<string, unknown>) || {},
    rest,
    value
  );
  return next;
}

function valueToString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function stringToValue(current: unknown, raw: string): unknown {
  if (current === null || current === undefined) return raw;
  if (typeof current === "number") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  }
  if (typeof current === "boolean") {
    return raw === "true";
  }
  if (typeof current === "object") {
    try {
      return JSON.parse(raw);
    } catch {
      return current;
    }
  }
  return raw;
}

export default function WorkshopClient({ slug }: { slug?: string }) {
  const [activeComponentId, setActiveComponentId] = useState<string>(COMPONENT_LIBRARY[0].id);
  const [activeVariantId, setActiveVariantId] = useState<string>(
    COMPONENT_LIBRARY[0].variants[0].id
  );
  const [props, setProps] = useState<Record<string, unknown>>({});
  const [draftSections, setDraftSections] = useState<RenderManifest["sections"]>({});
  const propsRef = useRef<Record<string, unknown>>({});
  const [siteData, setSiteData] = useState<SiteDataResponse | null>(null);
  const [loadingSite, setLoadingSite] = useState(Boolean(slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"tsx" | "html">("tsx");
  const [savedManifest, setSavedManifest] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProps({});
      return;
    }
    api.getSiteData(slug)
      .then((data) => {
        setSiteData(data);
        setDraftSections(data.manifest.sections);
        const first = data.manifest.section_order.find((id) => getComponentMeta(id)) || COMPONENT_LIBRARY[0].id;
        setActiveComponentId(first);
        setActiveVariantId(data.manifest.sections[first]?.variant || COMPONENT_LIBRARY.find((c) => c.id === first)?.variants[0].id || "v1");
        setProps(propsForComponent(first, data.business, data.manifest));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load this website"))
      .finally(() => setLoadingSite(false));
  }, [slug]);

  const activeComponent: ComponentMeta | undefined = getComponentMeta(activeComponentId);
  const activeVariant: VariantMeta | undefined = activeComponent?.variants.find(
    (v) => v.id === activeVariantId
  );

  const resolved = useMemo(
    () => (activeComponent && activeVariant ? resolveVariant(activeComponent.id, activeVariant.id) : null),
    [activeComponent, activeVariant]
  );

  const flatRows: FlatRow[] = useMemo(() => flatten(props), [props]);

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  function selectComponent(componentId: string) {
    if (!siteData) return;
    setDraftSections((previous) => {
      const currentSection = previous[activeComponentId] || { type: activeComponentId, data: {} };
      const nextSections = {
        ...previous,
        [activeComponentId]: { ...currentSection, variant: activeVariantId, data: propsRef.current },
      };
      const nextComponent = getComponentMeta(componentId);
      const nextSection = nextSections[componentId] || siteData.manifest.sections[componentId];
      setActiveComponentId(componentId);
      setActiveVariantId(nextSection?.variant || nextComponent?.variants[0]?.id || "v1");
      setProps(nextSection?.data || propsForComponent(componentId, siteData.business, siteData.manifest));
      return nextSections;
    });
  }

  function selectVariant(variantId: string) {
    setActiveVariantId(variantId);
    setDraftSections((previous) => ({
      ...previous,
      [activeComponentId]: { ...(previous[activeComponentId] || { type: activeComponentId }), variant: variantId, data: propsRef.current },
    }));
  }

  function updateFlat(keyPath: string[], raw: string) {
    setProps((prev) => {
      const current = keyPath.reduce<unknown>((acc, k) => {
        if (acc === null || typeof acc !== "object") return undefined;
        return (acc as Record<string, unknown>)[k];
      }, prev);
      const next = stringToValue(current, raw);
      return setAtPath(prev, keyPath, next);
    });
  }

  function resetToDefaults() {
    if (siteData) setProps(propsForComponent(activeComponentId, siteData.business, siteData.manifest));
  }

  async function saveAndDeploy() {
    if (!siteData || !activeComponent || !activeVariant) return;
    setSaving(true);
    setError(null);
    try {
      const sections = {
        ...draftSections,
        [activeComponent.id]: {
          ...(draftSections[activeComponent.id] || { type: activeComponent.id }),
          type: activeComponent.id,
          variant: activeVariant.id,
          data: propsRef.current,
        },
      };
      const nextManifest: RenderManifest = {
        ...siteData.manifest,
        sections,
        section_order: siteData.manifest.section_order.includes(activeComponent.id)
          ? siteData.manifest.section_order
          : [...siteData.manifest.section_order, activeComponent.id],
        components_used: Array.from(new Set([...siteData.manifest.components_used, activeComponent.id])),
      };
      await api.updateSiteManifest(siteData.site_id, nextManifest);
      await api.generateStatic(siteData.site_id);
      setSiteData({ ...siteData, manifest: nextManifest });
      setDraftSections(nextManifest.sections);
      setSavedManifest(JSON.stringify(nextManifest, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not deploy your changes");
    } finally {
      setSaving(false);
    }
  }

  function exportManifest() {
    if (!activeComponent || !activeVariant) return;
    const payload = {
      sections: {
        [activeComponent.id]: {
          type: activeComponent.id,
          variant: activeVariant.id,
          data: props,
        },
      },
    };
    setSavedManifest(JSON.stringify(payload, null, 2));
  }

  const filteredComponents = COMPONENT_LIBRARY.filter((c) =>
    search.trim()
      ? c.label.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const TsxComponent = resolved?.Component;

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeae3] font-sans antialiased text-[#26221e]">
      <header className="bg-[#171513] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all border border-white/15"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono font-bold text-[#e1b86a] uppercase tracking-[0.2em] self-start">
              Site studio
            </span>
            <h1 className="text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-none tracking-tight">
              {siteData?.business.name || "Component library"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={siteData ? saveAndDeploy : exportManifest}
            disabled={!activeComponent || !activeVariant || loadingSite || saving}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-md bg-[#e1b86a] hover:bg-[#f0cc82] text-[#171513] disabled:opacity-50 transition-all shadow-lg shadow-black/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{saving ? "Deploying..." : siteData ? "Save & deploy" : "Export JSON"}</span>
          </button>
        </div>
      </header>

      {error && <div className="bg-red-600 text-white text-xs px-4 py-2.5 text-center font-semibold">{error}</div>}
      {loadingSite ? <div className="flex-1 flex items-center justify-center text-sm text-gray-500">Loading your website...</div> : <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* LEFT — Component picker */}
        <aside className="w-full lg:w-72 bg-[#f8f5ef] border-b lg:border-b-0 lg:border-r border-black/10 flex flex-col max-h-[40vh] lg:max-h-none overflow-hidden">
          <div className="px-4 py-4 border-b border-black/10 sticky top-0 bg-[#f8f5ef] z-10">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-3.5 h-3.5 text-[#ad7932]" />
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                Components
              </span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search components…"
                className="w-full pl-8 pr-2 py-2 text-xs border border-black/10 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#c28b32]/40"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-0.5">
            {filteredComponents.map((c) => {
              const active = c.id === activeComponentId;
              return (
                <button
                  key={c.id}
                  onClick={() => selectComponent(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all border ${
                    active
                      ? "bg-[#201c19] border-[#201c19] text-white shadow-md"
                        : "border-transparent hover:bg-white text-[#4d4741]"
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{c.label}</div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      {c.variants.length} variant{c.variants.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  {c.hasTsx ? (
                    <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      TSX
                    </span>
                  ) : (
                    <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      HTML
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* CENTER — Variant picker + Preview */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#e8e3db]">
          {activeComponent && activeVariant && (
            <>
              <div className="px-4 py-3 bg-white border-b border-[#EAEAE8] flex flex-wrap items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                    {activeComponent.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {activeVariant.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 ml-2">
                  {activeComponent.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => selectVariant(v.id)}
                      className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md border transition-all ${
                        v.id === activeVariantId
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white border-[#EAEAE8] text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {v.id}
                    </button>
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setViewMode("tsx")}
                    disabled={!TSX_COMPONENT_IDS.includes(activeComponent.id as never)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      viewMode === "tsx" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-500"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    Live
                  </button>
                  <button
                    onClick={() => setViewMode("html")}
                    className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                      viewMode === "html" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-500"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    HTML
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,.75),transparent_34%),#e8e3db] p-4 md:p-8">
                {viewMode === "tsx" && TsxComponent ? (
                  <div className="library-component-preview bg-[#fffdf9] border border-black/10 shadow-[0_24px_70px_rgba(46,37,27,.14)] rounded-lg overflow-hidden">
                    <PreviewErrorBoundary>
                      <TsxComponent {...(props as VariantProps)} />
                    </PreviewErrorBoundary>
                  </div>
                ) : (
                  <div className="bg-[#fffdf9] border border-black/10 shadow-[0_24px_70px_rgba(46,37,27,.14)] rounded-lg overflow-hidden">
                    <div className="px-3 py-1.5 bg-gray-50 border-b border-[#EAEAE8] text-[10px] font-mono uppercase tracking-wider text-gray-500 flex items-center gap-2">
                      <Code2 className="w-3 h-3" />
                      {resolved?.htmlPath}
                    </div>
                    <iframe
                      src={resolved?.htmlPath}
                      className="w-full"
                      style={{ height: "70vh", border: "none" }}
                      title={`${activeComponent.id}-${activeVariantId}`}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* RIGHT — Editor */}
        <aside className="w-full lg:w-80 bg-[#f8f5ef] border-t lg:border-t-0 lg:border-l border-black/10 flex flex-col max-h-[50vh] lg:max-h-none overflow-hidden">
          <div className="px-4 py-4 border-b border-black/10 flex items-center justify-between sticky top-0 bg-[#f8f5ef] z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ad7932]" />
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                Editor
              </span>
            </div>
            <button
              onClick={resetToDefaults}
              className="text-[10px] font-mono uppercase tracking-wider text-[#756d63] hover:text-[#201c19]"
            >
              Reset
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {flatRows.length === 0 ? (
              <div className="text-center py-8 px-3 text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
                No editable props yet for this variant — pick another component
                or check back when the editor learns{" "}
                <span className="font-mono">{activeComponent?.id}</span>.
              </div>
            ) : (
              flatRows.map((row) => {
                const id = row.keyPath.join(".");
                return (
                  <label key={id} className="block">
                    <span className="block text-[9px] font-mono uppercase tracking-[0.12em] text-[#756d63] mb-1 truncate">
                      {id}
                    </span>
                    <input
                      value={valueToString(row.value)}
                      onChange={(e) => updateFlat(row.keyPath, e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-black/10 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#c28b32]/40"
                    />
                  </label>
                );
              })
            )}
          </div>
          {savedManifest && (
            <div className="border-t border-[#EAEAE8] bg-gray-50 max-h-[30vh] overflow-auto">
              <div className="px-3 py-2 flex items-center justify-between sticky top-0 bg-gray-50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                  Exported Manifest
                </span>
                <button
                  onClick={() => setSavedManifest(null)}
                  className="text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              <pre className="px-3 pb-3 text-[10px] font-mono text-gray-700 whitespace-pre-wrap break-all">
                {savedManifest}
              </pre>
            </div>
          )}
        </aside>
      </div>}
    </div>
  );
}