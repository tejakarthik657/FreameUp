"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Building2,
  Utensils,
  Users,
  FileText,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Globe,
  Plus,
} from "lucide-react";
import { API_URL } from "@/lib/api";
import Link from "next/link";

export default function AiImporterPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [rawText, setRawText] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [adopting, setAdopting] = useState<boolean>(false);

  // Extracted Parsed Data State
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [adoptionSuccess, setAdoptionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBusinesses(data);
          setSelectedId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleSampleClick = (sampleText: string) => {
    setRawText(sampleText);
    setParsedData(null);
    setAdoptionSuccess(null);
  };

  const handleAnalyze = async () => {
    if (!rawText || !rawText.trim()) return;
    setAnalyzing(true);
    setParsedData(null);
    setAdoptionSuccess(null);

    try {
      const res = await fetch(`${API_URL}/ai-importer/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText }),
      });
      const data = await res.json();
      if (res.ok && data.parsed_data) {
        setParsedData(data.parsed_data);
      } else {
        alert(data.detail || "Failed to analyze raw text.");
      }
    } catch (e: any) {
      alert("Error calling AI analysis engine: " + e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAdoptData = async () => {
    if (!parsedData || adopting) return;
    setAdopting(true);
    setAdoptionSuccess(null);

    try {
      const res = await fetch(`${API_URL}/ai-importer/adopt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId || null,
          business: parsedData.business,
          catalog: parsedData.catalog,
          staff: parsedData.staff,
          invoices: parsedData.invoices,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdoptionSuccess(data.message || "Successfully adopted all data across application!");
      } else {
        alert(data.detail || "Failed to adopt data.");
      }
    } catch (e: any) {
      alert("Error adopting data: " + e.message);
    } finally {
      setAdopting(false);
    }
  };

  const sample1 = `Shop Name: Royal Spice Restaurant & Bistro
Phone: 9876543210 | Email: contact@royalspice.in | UPI ID: royalspice@okicici
Address: 45 MG Road, Connaught Place, New Delhi - 110001
Menu Items:
- Butter Chicken Bowl (₹340) - Creamy charcoal grilled chicken curry
- Paneer Tikka Platter (₹280) - Fresh cottage cheese in tandoori spices
- Mango Lassi Special (₹120) - Fresh Alphonso pulp yogurt drink
Staff Details:
- Chef Vikram Sharma (Role: Master Chef, Phone: 9811223344, Daily Wage: ₹1200)
- Suresh Helper (Role: Kitchen Assistant, Phone: 9811223355, Daily Wage: ₹750)
Pending Invoices:
- Customer: Ananya Roy (Phone: 9899001122, Order: 2x Butter Chicken, Total: ₹680)`;

  const sample2 = `Glamour Locks Luxury Beauty & Spa
Address: Road No 36, Jubilee Hills, Hyderabad
Phone: 9123456789 | UPI: glamourlocks@ybl | GSTIN: 36AAAAA0000A1Z5
Services Catalog:
- Royal Hair Spa & Keratin (₹2500)
- Bridal Makeup & Styling (₹8500)
- Organic Fruit Facial (₹1800)
Staff Team:
- Priya Nair (Role: Senior Hair Stylist, Phone: 9988776655, Daily Wage: ₹1500)
- Lakshmi Devi (Role: Spa Therapist, Phone: 9988776644, Daily Wage: ₹1000)
Recent Invoices:
- Client: Kavitha Reddy (Phone: 9700112233, Service: Hair Spa + Facial, Total: ₹4300)`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <Sparkles className="w-6 h-6 text-amber-800" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">AI Smart Magic Data Importer</h1>
          </div>
          <p className="text-xs text-[#6a6a6a]">
            Paste any unstructured text, WhatsApp notes, staff lists, or price sheets. The AI will extract all structured data and apply it across your entire application in 1 click!
          </p>
        </div>

        {Array.isArray(businesses) && businesses.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6a6a6a]">Target Business:</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs font-semibold text-[#0a0a0a] focus:outline-none"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Raw Input Box & Sample Pills */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#0a0a0a] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-800" /> Paste Raw Unstructured Business Data
          </label>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-[#6a6a6a] font-bold">Try Sample Text:</span>
            <button
              onClick={() => handleSampleClick(sample1)}
              className="px-2.5 py-1 bg-[#faf5e8] hover:bg-[#e5e5e5] text-amber-900 rounded-lg text-[11px] font-bold"
            >
              Restaurant Sample
            </button>
            <button
              onClick={() => handleSampleClick(sample2)}
              className="px-2.5 py-1 bg-[#faf5e8] hover:bg-[#e5e5e5] text-amber-900 rounded-lg text-[11px] font-bold"
            >
              Salon & Spa Sample
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          placeholder="Paste raw notes here... e.g. WhatsApp messages, staff daily wages, menu items, phone numbers, or invoice requests..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !rawText.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] hover:bg-[#1f1f1f] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> AI Extracting & Structuring...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" /> ⚡ Analyze & Filter Data with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Adoption Banner */}
      {adoptionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-900">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="text-base font-bold">{adoptionSuccess}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dashboard/staff"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl"
            >
              <Users className="w-4 h-4" /> View Workers Desk
            </Link>

            <Link
              href="/dashboard/invoices"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0a0a0a] text-white text-xs font-bold rounded-xl"
            >
              <FileText className="w-4 h-4" /> View Invoices Registry
            </Link>

            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl"
            >
              <Building2 className="w-4 h-4" /> View Business Profile
            </Link>
          </div>
        </div>
      )}

      {/* Structured Analysis Output Preview */}
      {parsedData && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0a0a0a]">AI Filtered & Extracted Content</h2>
              <p className="text-xs text-[#6a6a6a]">Review all structured categories extracted from your raw input.</p>
            </div>

            <button
              onClick={handleAdoptData}
              disabled={adopting}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md animate-pulse"
            >
              {adopting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Syncing Application...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> 🚀 Adopt All Data Across Application (1-Click)
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Business Details Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b pb-2">
                <Building2 className="w-5 h-5 text-amber-800" />
                <h3 className="text-sm font-bold text-[#0a0a0a]">Extracted Business Profile</h3>
              </div>

              {parsedData.business ? (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#6a6a6a]">Name:</span>
                    <span className="font-bold text-[#0a0a0a]">{parsedData.business.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#6a6a6a]">Category:</span>
                    <span className="font-bold text-amber-800 uppercase">{parsedData.business.category || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#6a6a6a]">Phone:</span>
                    <span className="font-mono font-bold text-[#0a0a0a]">{parsedData.business.phone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#6a6a6a]">UPI ID:</span>
                    <span className="font-mono text-emerald-800 font-bold">{parsedData.business.upi_id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#6a6a6a]">Address:</span>
                    <span className="text-[#3a3a3a] text-right max-w-xs">{parsedData.business.address || "N/A"}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#6a6a6a] italic">No business profile metadata found.</p>
              )}
            </div>

            {/* Menu / Service Catalog */}
            <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-800" />
                  <h3 className="text-sm font-bold text-[#0a0a0a]">Extracted Menu / Services Catalog</h3>
                </div>
                <span className="text-xs font-mono font-bold bg-[#faf5e8] text-amber-900 px-2 py-0.5 rounded-full">
                  {(parsedData.catalog || []).length} items
                </span>
              </div>

              {(!parsedData.catalog || parsedData.catalog.length === 0) ? (
                <p className="text-xs text-[#6a6a6a] italic">No catalog items detected.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {parsedData.catalog.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-[#fffaf0] p-2.5 rounded-xl border border-[#e5e5e5] text-xs">
                      <div>
                        <span className="font-bold text-[#0a0a0a] block">{item.name}</span>
                        {item.description && <span className="text-[10px] text-[#6a6a6a] block">{item.description}</span>}
                      </div>
                      <span className="font-mono font-bold text-amber-900">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Staff & Workers Roster */}
            <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-800" />
                  <h3 className="text-sm font-bold text-[#0a0a0a]">Extracted Staff & Worker Roster</h3>
                </div>
                <span className="text-xs font-mono font-bold bg-[#faf5e8] text-amber-900 px-2 py-0.5 rounded-full">
                  {(parsedData.staff || []).length} workers
                </span>
              </div>

              {(!parsedData.staff || parsedData.staff.length === 0) ? (
                <p className="text-xs text-[#6a6a6a] italic">No staff members detected.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {parsedData.staff.map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-[#fffaf0] p-2.5 rounded-xl border border-[#e5e5e5] text-xs">
                      <div>
                        <span className="font-bold text-[#0a0a0a] block">{s.name}</span>
                        <span className="text-[10px] text-[#6a6a6a] font-mono block">{s.role} • {s.phone}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-900">₹{s.daily_wage}/day</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extracted Invoices */}
            <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-800" />
                  <h3 className="text-sm font-bold text-[#0a0a0a]">Extracted Invoices & Orders</h3>
                </div>
                <span className="text-xs font-mono font-bold bg-[#faf5e8] text-amber-900 px-2 py-0.5 rounded-full">
                  {(parsedData.invoices || []).length} invoices
                </span>
              </div>

              {(!parsedData.invoices || parsedData.invoices.length === 0) ? (
                <p className="text-xs text-[#6a6a6a] italic">No customer invoices detected.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {parsedData.invoices.map((inv: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-[#fffaf0] p-2.5 rounded-xl border border-[#e5e5e5] text-xs">
                      <div>
                        <span className="font-bold text-[#0a0a0a] block">{inv.customer_name}</span>
                        <span className="text-[10px] text-[#6a6a6a] font-mono block">Phone: {inv.customer_phone}</span>
                      </div>
                      <span className="font-mono font-bold text-[#0a0a0a]">₹{inv.total_amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
