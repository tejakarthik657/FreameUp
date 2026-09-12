"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, API_URL } from "@/lib/api";
import type { WebsiteOut, BusinessOut } from "@/lib/types";
import {
  ExternalLink,
  Copy,
  Check,
  Clock,
  QrCode,
  Sparkles,
  Plus,
  Inbox,
  Download,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Pencil,
  Bot,
  Activity,
  Globe,
  Gift,
  FileText,
  Laptop,
  ArrowRight,
} from "lucide-react";

interface BusinessLeadsPanelProps {
  businessId: string;
  businessName: string;
}

function BusinessLeadsPanel({ businessId, businessName }: BusinessLeadsPanelProps) {
  const [leads, setLeads] = useState<import("@/lib/types").LeadResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listLeads(businessId)
      .then((res) => {
        setLeads(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load leads");
        setLoading(false);
      });
  }, [businessId]);

  function handleExport() {
    if (!Array.isArray(leads) || leads.length === 0) return;
    const headers = ["Name", "Email", "Phone", "Message", "Submitted At"];
    const rows = leads.map((l) => [
      l.name || "",
      l.email || "",
      l.phone || "",
      l.message || "",
      l.created_at ? new Date(l.created_at).toLocaleString() : "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${(businessName || "business").toLowerCase().replace(/\s+/g, "_")}_leads.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 border-t border-[#EAEAE8] text-center text-xs text-gray-500 font-medium">
        <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2" />
        Loading submitted quotes & leads...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50/50 border-t border-rose-100 text-center text-xs text-rose-600 font-medium">
        Error loading leads: {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-t border-[#EAEAE8] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Inbox className="w-4 h-4 text-gray-600" />
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Leads Inbox ({Array.isArray(leads) ? leads.length : 0})
          </h3>
        </div>
        {Array.isArray(leads) && leads.length > 0 && (
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E2E2DF] hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded transition-all shadow-2xs"
          >
            <Download className="w-3 h-3" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {!Array.isArray(leads) || leads.length === 0 ? (
        <div className="text-center py-6 text-xs text-gray-400">
          No leads submitted yet. Leads from your site's contact form will appear here.
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white border border-[#EAEAE8] rounded-lg p-4 shadow-2xs flex flex-col md:flex-row md:items-start justify-between gap-4 animate-fade-in"
            >
              <div className="space-y-2 flex-1 text-left">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-xs font-bold text-gray-800">{lead.name}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> {lead.email}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {lead.phone}
                  </span>
                </div>
                {lead.message && (
                  <p className="text-xs text-gray-600 bg-gray-50 rounded-md p-2.5 border border-slate-100 italic leading-relaxed">
                    "{lead.message}"
                  </p>
                )}
              </div>
              <div className="text-[10px] font-mono text-gray-400 self-end md:self-start">
                {lead.created_at ? new Date(lead.created_at).toLocaleString() : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [sites, setSites] = useState<WebsiteOut[]>([]);
  const [businesses, setBusinesses] = useState<BusinessOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedLeads, setExpandedLeads] = useState<Record<string, boolean>>({});

  // Module Output Metrics
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalPasses, setTotalPasses] = useState<number>(0);

  useEffect(() => {
    Promise.all([
      api.listBusinesses().catch(() => [] as BusinessOut[]),
      api.listSites().catch(() => [] as WebsiteOut[]),
    ]).then(([bizList, siteList]) => {
      const safeBiz = Array.isArray(bizList) ? bizList : [];
      const safeSites = Array.isArray(siteList) ? siteList : [];
      setBusinesses(safeBiz as BusinessOut[]);
      setSites(safeSites as WebsiteOut[]);
      setLoading(false);

      if (safeBiz.length > 0) {
        const primaryId = safeBiz[0].id;
        if (primaryId) {
          // Fetch Live Outputs Metrics safely
          fetch(`${API_URL}/operations/orders/${primaryId}`)
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => setTotalOrders(Array.isArray(data) ? data.length : 0))
            .catch(() => {});

          fetch(`${API_URL}/invoices/${primaryId}`)
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => {
              if (Array.isArray(data)) {
                setTotalInvoices(data.length);
                const sum = data.reduce((acc: number, inv: any) => acc + (inv?.total_amount || 0), 0);
                setTotalRevenue(sum);
              }
            })
            .catch(() => {});

          fetch(`${API_URL}/loyalty/passes/${primaryId}`)
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => setTotalPasses(Array.isArray(data) ? data.length : 0))
            .catch(() => {});
        }
      }
    });
  }, []);

  async function handleGenerateStatic(siteId: string) {
    setGenerating(siteId);
    try {
      await api.generateStatic(siteId);
      const updated = await api.listSites().catch(() => [] as WebsiteOut[]);
      setSites(Array.isArray(updated) ? (updated as WebsiteOut[]) : []);
    } catch (e) {
      alert("Static generation failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setGenerating(null);
    }
  }

  function copyToClipboard(text: string, key: string) {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    });
  }

  const businessMap = Object.fromEntries(
    (Array.isArray(businesses) ? businesses : []).map((b) => [b.id, b])
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Loading Enterprise Command Dashboard...
      </div>
    );
  }

  const safeSitesList = Array.isArray(sites) ? sites : [];

  return (
    <div className="space-y-8 font-sans antialiased text-[#0a0a0a]">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e5e5] pb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0a0a0a] tracking-tight">Enterprise Command Desk</h1>
          <p className="text-xs text-[#6a6a6a] mt-1">Real-time business performance outputs & active platform modules.</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Build New Website</span>
        </Link>
      </div>

      {/* Real-Time Live Outputs & Feature Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Invoices & Revenue */}
        <div className="bg-[#ffb084] text-[#0a0a0a] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 font-mono">Invoice Revenue</span>
            <FileText className="w-5 h-5 opacity-70" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono">${(totalRevenue || 0).toFixed(2)}</span>
            <p className="text-[11px] font-semibold mt-1 opacity-90">{totalInvoices} Invoices Generated</p>
          </div>
        </div>

        {/* Metric 2: Live Operations Queue */}
        <div className="bg-[#a4d4c5] text-[#0a0a0a] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 font-mono">Operations Queue</span>
            <Activity className="w-5 h-5 opacity-70" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono">{totalOrders}</span>
            <p className="text-[11px] font-semibold mt-1 opacity-90">Live Orders & Bookings</p>
          </div>
        </div>

        {/* Metric 3: Digital Loyalty Passes */}
        <div className="bg-[#e8b94a] text-[#0a0a0a] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 font-mono">Loyalty Passes</span>
            <Gift className="w-5 h-5 opacity-70" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono">{totalPasses}</span>
            <p className="text-[11px] font-semibold mt-1 opacity-90">Active Customer Punch Cards</p>
          </div>
        </div>

        {/* Metric 4: Live Websites */}
        <div className="bg-[#b8a4ed] text-[#0a0a0a] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 font-mono">Active Sites</span>
            <Sparkles className="w-5 h-5 opacity-70" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black font-mono">{safeSitesList.length}</span>
            <p className="text-[11px] font-semibold mt-1 opacity-90">Published & Subdomain Live</p>
          </div>
        </div>

      </div>

      {/* Quick Action Enterprise Module Hub */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
          Enterprise Operating Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <Link
            href="/dashboard/ai-agent"
            className="p-5 bg-white rounded-2xl border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all shadow-xs group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <Bot className="w-6 h-6 text-[#0a0a0a]" />
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0a0a0a]">AI Assistant</h3>
              <p className="text-[10px] text-[#6a6a6a] mt-0.5">24/7 Concierge Q&A</p>
            </div>
          </Link>

          <Link
            href="/dashboard/operations"
            className="p-5 bg-white rounded-2xl border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all shadow-xs group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <Activity className="w-6 h-6 text-emerald-600" />
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0a0a0a]">Operations Desk</h3>
              <p className="text-[10px] text-[#6a6a6a] mt-0.5">Live Order Terminal</p>
            </div>
          </Link>

          <Link
            href="/dashboard/localization"
            className="p-5 bg-white rounded-2xl border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all shadow-xs group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <Globe className="w-6 h-6 text-indigo-600" />
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0a0a0a]">AI Localizer</h3>
              <p className="text-[10px] text-[#6a6a6a] mt-0.5">1-Click Translations</p>
            </div>
          </Link>

          <Link
            href="/dashboard/loyalty"
            className="p-5 bg-white rounded-2xl border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all shadow-xs group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <Gift className="w-6 h-6 text-amber-600" />
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0a0a0a]">Digital Loyalty</h3>
              <p className="text-[10px] text-[#6a6a6a] mt-0.5">Punch Cards & Passes</p>
            </div>
          </Link>

          <Link
            href="/dashboard/invoices"
            className="p-5 bg-white rounded-2xl border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all shadow-xs group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <FileText className="w-6 h-6 text-amber-800" />
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0a0a0a]">Invoices Engine</h3>
              <p className="text-[10px] text-[#6a6a6a] mt-0.5">Print & WhatsApp Receipts</p>
            </div>
          </Link>

        </div>
      </div>

      {/* Active Deployments List */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
          Active Website Deployments
        </h2>

        {safeSitesList.length === 0 ? (
          <div className="bg-[#faf5e8] border border-[#e5e5e5] rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm font-sans">
            <h3 className="text-base font-bold text-[#0a0a0a] mb-2">Create your first website</h3>
            <p className="text-xs text-[#6a6a6a] mb-6 leading-relaxed">No sites have been generated yet. Give us a few details and go live instantly.</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Website</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {safeSitesList.map((site) => {
              const biz = site?.business_id ? businessMap[site.business_id] : null;
              return (
                <div key={site.id} className="bg-[#faf5e8] border border-[#e5e5e5] rounded-3xl shadow-xs overflow-hidden flex flex-col justify-between">
                  
                  {/* Site Details */}
                  <div className="p-6 border-b border-[#e5e5e5] flex flex-col sm:flex-row justify-between sm:items-start gap-4 bg-[#fffaf0]">
                    <div className="space-y-1">
                      <h2 className="text-sm font-bold text-gray-900">{biz?.name ?? "Unnamed Business"}</h2>
                      <p className="text-xs text-gray-400 capitalize tracking-wide font-mono">
                        {biz?.category?.replace("_", " ") || "Business"} &bull; {site.template}
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
                    <button
                      onClick={() => setExpandedLeads((prev) => ({ ...prev, [site.id]: !prev[site.id] }))}
                      className="text-xs font-semibold uppercase tracking-wider border border-[#E2E2DF] bg-[#fffaf0] px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 transition-all shadow-2xs flex items-center gap-1.5"
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>{expandedLeads[site.id] ? "Hide Leads" : "View Leads"}</span>
                      {expandedLeads[site.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <Link
                      href={`/preview/${site.slug}`}
                      target="_blank"
                      className="text-xs font-semibold uppercase tracking-wider border border-[#E2E2DF] bg-[#fffaf0] px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 transition-all shadow-2xs"
                    >
                      Configure Preview
                    </Link>
                    <Link
                      href={`/workshop/${site.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider border border-gray-900 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all shadow-2xs"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Website</span>
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

                  {expandedLeads[site.id] && biz && (
                    <BusinessLeadsPanel businessId={biz.id} businessName={biz.name} />
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
