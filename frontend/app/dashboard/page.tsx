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
  Users,
  Boxes,
  Truck,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
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
      <div className="p-6 bg-[#fafafc] border-t border-[#e0e0e0] text-center text-xs text-[#86868b]">
        <div className="w-5 h-5 border-2 border-[#0066cc]/30 border-t-[#0066cc] rounded-full animate-spin mx-auto mb-2" />
        Loading customer quotes & inquiries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border-t border-rose-100 text-center text-xs text-rose-600 font-medium">
        Error loading leads: {error}
      </div>
    );
  }

  return (
    <div className="bg-[#fafafc] border-t border-[#e0e0e0] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Inbox className="w-4 h-4 text-[#1d1d1f]" />
          <h3 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
            Customer Inquiries ({Array.isArray(leads) ? leads.length : 0})
          </h3>
        </div>
        {Array.isArray(leads) && leads.length > 0 && (
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-[#e0e0e0] hover:bg-[#f5f5f7] text-[#1d1d1f] px-3 py-1.5 rounded-full transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#0066cc]" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {!Array.isArray(leads) || leads.length === 0 ? (
        <div className="text-center py-6 text-xs text-[#86868b]">
          No inquiries submitted yet. Customer form submissions will appear here.
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white border border-[#e0e0e0] rounded-xl p-4 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 text-left">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-xs font-bold text-[#1d1d1f]">{lead.name}</span>
                  <span className="flex items-center gap-1 text-[11px] text-[#86868b]">
                    <Mail className="w-3.5 h-3.5 text-[#0066cc]" /> {lead.email}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[#86868b]">
                    <Phone className="w-3.5 h-3.5 text-[#0066cc]" /> {lead.phone}
                  </span>
                </div>
                {lead.message && (
                  <p className="text-xs text-[#1d1d1f] bg-[#f5f5f7] rounded-lg p-2.5 border border-[#e0e0e0] leading-relaxed">
                    "{lead.message}"
                  </p>
                )}
              </div>
              <div className="text-[10px] font-mono text-[#86868b] self-end md:self-start">
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

  // Real Module Output Metrics
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
      <div className="p-12 text-center text-xs font-mono text-[#86868b]">
        <div className="w-6 h-6 border-2 border-[#0066cc]/30 border-t-[#0066cc] rounded-full animate-spin mx-auto mb-3" />
        Loading Enterprise Workspace...
      </div>
    );
  }

  const safeSitesList = Array.isArray(sites) ? sites : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans antialiased text-[#1d1d1f]">
      
      {/* Overview Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e0e0] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f]">
            Operations Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b] mt-1">
            Real-time business performance outputs & active platform engines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/create"
            className="apple-btn-primary text-xs py-2 px-5 font-normal flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Website</span>
          </Link>
        </div>
      </div>

      {/* Real-Time Live Outputs & Feature Metrics Grid (Apple Utility Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Invoice Revenue */}
        <div className="apple-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Billed Revenue
            </span>
            <FileText className="w-4 h-4 text-[#0066cc]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            ₹{(totalRevenue || 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-[#86868b] font-medium">
            {totalInvoices} Invoices generated
          </p>
        </div>

        {/* Metric 2: Live Operations Queue */}
        <div className="apple-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Operations Queue
            </span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            {totalOrders}
          </div>
          <p className="text-[11px] text-[#86868b] font-medium">
            Live orders & table bookings
          </p>
        </div>

        {/* Metric 3: Digital Loyalty Passes */}
        <div className="apple-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Loyalty Passes
            </span>
            <Gift className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            {totalPasses}
          </div>
          <p className="text-[11px] text-[#86868b] font-medium">
            Active customer punch cards
          </p>
        </div>

        {/* Metric 4: Active Sites */}
        <div className="apple-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Active Storefronts
            </span>
            <Sparkles className="w-4 h-4 text-[#0066cc]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            {safeSitesList.length}
          </div>
          <p className="text-[11px] text-[#86868b] font-medium">
            Published Next.js sites
          </p>
        </div>

      </div>

      {/* Quick Action Enterprise Module Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#86868b]">
            Enterprise Operating Modules
          </h2>
          <span className="text-xs text-[#0066cc] font-medium">
            100% Real Live Stack
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            href="/dashboard/ai-importer"
            className="apple-card hover:border-[#0066cc] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-5 h-5 text-[#0066cc]" />
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 group-hover:text-[#0066cc] transition-all" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#0066cc] uppercase font-bold">Wedge 1</span>
              <h3 className="text-sm font-semibold text-[#1d1d1f] mt-0.5">AI Data Importer</h3>
              <p className="text-xs text-[#86868b] mt-1">Flatfile alternative with auto-fix.</p>
            </div>
          </Link>

          <Link
            href="/dashboard/dpdp-gateway"
            className="apple-card hover:border-[#0066cc] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 group-hover:text-[#0066cc] transition-all" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-600 uppercase font-bold">Wedge 2</span>
              <h3 className="text-sm font-semibold text-[#1d1d1f] mt-0.5">DPDP AI DataTrust</h3>
              <p className="text-xs text-[#86868b] mt-1">Aadhaar/PAN PII scrub & safe AI proxy.</p>
            </div>
          </Link>

          <Link
            href="/dashboard/ai-agent"
            className="apple-card hover:border-[#0066cc] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <Globe className="w-5 h-5 text-[#0066cc]" />
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 group-hover:text-[#0066cc] transition-all" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#86868b] uppercase font-bold">Maps & AI</span>
              <h3 className="text-sm font-semibold text-[#1d1d1f] mt-0.5">Ask Map Assistant</h3>
              <p className="text-xs text-[#86868b] mt-1">CARTO tiles & real OSM POIs.</p>
            </div>
          </Link>

          <Link
            href="/dashboard/invoices"
            className="apple-card hover:border-[#0066cc] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-5 h-5 text-amber-600" />
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 group-hover:text-[#0066cc] transition-all" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#86868b] uppercase font-bold">Billing</span>
              <h3 className="text-sm font-semibold text-[#1d1d1f] mt-0.5">Invoices & WhatsApp</h3>
              <p className="text-xs text-[#86868b] mt-1">GST tax invoices & payment alerts.</p>
            </div>
          </Link>

        </div>
      </div>

      {/* Active Deployments List (Apple Store Card Format) */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#86868b]">
          Active Digital Storefronts ({safeSitesList.length})
        </h2>

        {safeSitesList.length === 0 ? (
          <div className="apple-card text-center max-w-lg mx-auto py-12 space-y-4">
            <h3 className="text-base font-semibold text-[#1d1d1f]">Create your first website</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              No websites generated yet. Launch your high-converting business portal in 5 minutes.
            </p>
            <Link
              href="/create"
              className="apple-btn-primary text-xs py-2 px-6 font-normal inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Website</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {safeSitesList.map((site) => {
              const biz = site?.business_id ? businessMap[site.business_id] : null;
              return (
                <div key={site.id} className="apple-card p-0 overflow-hidden shadow-xs">
                  
                  {/* Site Header */}
                  <div className="p-6 border-b border-[#e0e0e0] flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#fafafc]">
                    <div>
                      <h2 className="text-base font-semibold text-[#1d1d1f]">
                        {biz?.name ?? "My Business"}
                      </h2>
                      <p className="text-xs text-[#86868b] capitalize mt-0.5 font-mono">
                        {biz?.category?.replace("_", " ") || "Business"} · Template: {site.template}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {site.is_static ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Static Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Dynamic Server
                        </span>
                      )}
                    </div>
                  </div>

                  {/* URLs & QR Container */}
                  <div className="p-6 grid sm:grid-cols-3 gap-6 items-center">
                    <div className="sm:col-span-2 space-y-4">
                      {/* Preview URL */}
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#86868b] tracking-wider block mb-1">
                          Preview Route
                        </span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/preview/${site.slug}`}
                            target="_blank"
                            className="text-xs text-[#0066cc] font-medium hover:underline flex items-center gap-1 truncate"
                          >
                            <span>/preview/{site.slug}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => copyToClipboard(`/preview/${site.slug}`, `preview-${site.id}`)}
                            className="text-[#86868b] hover:text-[#1d1d1f] transition-colors"
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
                        <span className="text-[10px] font-mono uppercase text-[#86868b] tracking-wider block mb-1">
                          Live Domain
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={site.published_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#1d1d1f] font-semibold hover:underline flex items-center gap-1 truncate"
                          >
                            <span>{site.published_url}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => copyToClipboard(site.published_url, `pub-${site.id}`)}
                            className="text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                            title="Copy Live URL"
                          >
                            {copied === `pub-${site.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    {site.qr_url && (
                      <div className="flex flex-col items-center justify-center p-3 border border-[#e0e0e0] rounded-2xl bg-[#fafafc] max-w-[130px] mx-auto text-center gap-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={site.qr_url} alt="QR Code" className="w-20 h-20 bg-white rounded-lg p-1 border border-[#e0e0e0]" />
                        <span className="text-[10px] font-mono text-[#86868b] uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <QrCode className="w-3 h-3 text-[#0066cc]" /> Scan QR
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="px-6 py-3.5 bg-[#fafafc] border-t border-[#e0e0e0] flex flex-wrap gap-2.5 justify-end items-center">
                    <button
                      onClick={() => setExpandedLeads((prev) => ({ ...prev, [site.id]: !prev[site.id] }))}
                      className="text-xs font-medium text-[#1d1d1f] bg-white border border-[#e0e0e0] px-3.5 py-1.5 rounded-full hover:bg-[#f5f5f7] transition-all flex items-center gap-1.5"
                    >
                      <Inbox className="w-3.5 h-3.5 text-[#0066cc]" />
                      <span>{expandedLeads[site.id] ? "Hide Inquiries" : "View Inquiries"}</span>
                      {expandedLeads[site.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    <Link
                      href={`/workshop/${site.slug}`}
                      className="text-xs font-medium text-white bg-[#1d1d1f] hover:bg-[#333333] px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Design</span>
                    </Link>
                    <button
                      onClick={() => handleGenerateStatic(site.id)}
                      disabled={generating === site.id}
                      className="apple-btn-primary text-xs py-1.5 px-4 font-normal flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {generating === site.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Exporting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{site.is_static ? "Re-publish Static" : "Publish Static"}</span>
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
