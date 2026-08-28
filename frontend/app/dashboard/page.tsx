"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { WebsiteOut, BusinessOut } from "@/lib/types";
import { ExternalLink, Copy, Check, Clock, QrCode, Sparkles, AlertCircle, Plus } from "lucide-react";

export default function DashboardPage() {
  const [sites, setSites] = useState<WebsiteOut[]>([]);
  const [businesses, setBusinesses] = useState<BusinessOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.listBusinesses().catch(() => [] as BusinessOut[]),
      api.listSites().catch(() => [] as WebsiteOut[]),
    ]).then(([bizList, siteList]) => {
      setBusinesses(bizList as BusinessOut[]);
      setSites(siteList as WebsiteOut[]);
      setLoading(false);
    });
  }, []);

  async function handleGenerateStatic(siteId: string) {
    setGenerating(siteId);
    try {
      await api.generateStatic(siteId);
      const updated = await api.listSites().catch(() => [] as WebsiteOut[]);
      setSites(updated as WebsiteOut[]);
    } catch (e) {
      alert("Static generation failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setGenerating(null);
    }
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    });
  }

  const businessMap = Object.fromEntries(businesses.map((b) => [b.id, b]));

  const totalImages = businesses.reduce((acc, biz) => {
    let count = 0;
    if (biz.logo) count += 1;
    if (biz.images) count += biz.images.length;
    if (biz.featured_images) count += biz.featured_images.length;
    if (biz.menu_image_url) count += 1;
    if (biz.team) {
      biz.team.forEach((m) => {
        if (m.image) count += 1;
      });
    }
    return acc + count;
  }, 0);

  if (loading) {
    return (
      <div className="space-y-8 font-sans animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAE8] pb-6">
          <div className="space-y-2 w-full md:w-1/3">
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
          <div className="h-10 bg-gray-200 rounded-md w-32 shrink-0" />
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-[#EAEAE8] rounded-xl p-5 shadow-2xs space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>

        {/* Deployments skeleton cards */}
        <div className="grid gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-[#EAEAE8] rounded-xl p-6 shadow-2xs space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-24" />
              </div>
              <div className="border-t border-[#EAEAE8] pt-4 flex gap-4">
                <div className="h-4 bg-gray-100 rounded w-20" />
                <div className="h-4 bg-gray-100 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white border border-[#EAEAE8] rounded-xl p-12 text-center max-w-lg mx-auto shadow-xs font-sans">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Create your first website</h3>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">No sites have been generated yet. Give us a few details and go live instantly.</p>
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-md transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Website</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAE8] pb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Active Deployments</h1>
          <p className="text-xs text-gray-500 mt-1">Manage static exports, design settings, and QR endpoints.</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-md transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Site</span>
        </Link>
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#EAEAE8] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Total Sites</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-2">{sites.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1">Live & Active</span>
        </div>
        <div className="bg-white border border-[#EAEAE8] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Images Uploaded</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-2">{totalImages}</span>
          <span className="text-[10px] text-indigo-600 font-semibold mt-1">Optimized assets</span>
        </div>
        <div className="bg-white border border-[#EAEAE8] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Active Subdomains</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-2">{sites.filter((s) => s.published_url).length}</span>
          <span className="text-[10px] text-amber-600 font-semibold mt-1">devframes.in wildcards</span>
        </div>
      </div>

      <div className="grid gap-6">
        {sites.map((site) => {
          const biz = businessMap[site.business_id];
          return (
            <div key={site.id} className="bg-white border border-[#EAEAE8] rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
              
              {/* Site Details */}
              <div className="p-6 border-b border-[#EAEAE8] flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-gray-900">{biz?.name ?? "Unnamed Business"}</h2>
                  <p className="text-xs text-gray-400 capitalize tracking-wide font-mono">
                    {biz?.category?.replace("_", " ")} &bull; {site.template}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {site.is_static ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800">
                      Static Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-800">
                      Dynamic Only
                    </span>
                  )}
                </div>
              </div>

              {/* URLs + Share Panel */}
              <div className="p-6 grid sm:grid-cols-3 gap-8 items-center border-b border-[#EAEAE8]">
                <div className="sm:col-span-2 space-y-4">
                  {/* Preview URL */}
                  <div>
                    <span className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider block mb-1">
                      Preview Link
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/preview/${site.slug}`}
                        target="_blank"
                        className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1 truncate"
                      >
                        <span>/preview/{site.slug}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => copyToClipboard(`/preview/${site.slug}`, `preview-${site.id}`)}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        title="Copy Preview URL"
                      >
                        {copied === `preview-${site.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Published URL */}
                  <div>
                    <span className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider block mb-1">
                      Published Domain
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={site.published_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-800 font-semibold hover:underline flex items-center gap-1 truncate"
                      >
                        <span>{site.published_url}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(site.published_url, `pub-${site.id}`)}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        title="Copy Published URL"
                      >
                        {copied === `pub-${site.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Logs timestamp */}
                  {site.is_static && site.static_generated_at && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Static pre-render generated at {new Date(site.static_generated_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* QR Code Container */}
                {site.qr_url && (
                  <div className="flex flex-col items-center justify-center p-3 border border-[#EAEAE8] rounded-xl bg-gray-50 max-w-[140px] mx-auto text-center gap-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={site.qr_url} alt="QR Code" className="w-20 h-20 bg-white border border-[#E2E2DF] rounded-md shadow-xs p-1" />
                    <span className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5" /> Scan QR
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-2.5 justify-end">
                <Link
                  href={`/preview/${site.slug}`}
                  target="_blank"
                  className="text-xs font-semibold uppercase tracking-wider border border-[#E2E2DF] bg-white px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 transition-all shadow-2xs"
                >
                  Configure Preview
                </Link>
                <button
                  onClick={() => handleGenerateStatic(site.id)}
                  disabled={generating === site.id}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all shadow-2xs disabled:opacity-50"
                >
                  {generating === site.id ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{site.is_static ? "Re-publish Static HTML" : "Publish Static HTML"}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
