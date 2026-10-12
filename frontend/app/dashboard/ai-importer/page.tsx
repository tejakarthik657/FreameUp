"use client";

import { useState, useEffect, useRef } from "react";
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
  UploadCloud,
  FileSpreadsheet,
  Table,
  ShieldCheck,
  AlertCircle,
  Code2,
} from "lucide-react";
import { API_URL } from "@/lib/api";
import Link from "next/link";

export default function AiImporterPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [rawText, setRawText] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [adopting, setAdopting] = useState<boolean>(false);

  // Tab: "csv" or "unstructured" or "embed"
  const [ingestMode, setIngestMode] = useState<"csv" | "unstructured" | "embed">("csv");

  // Tabular file state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [tableData, setTableData] = useState<{ headers: string[]; rows: any[] } | null>(null);
  const [cleanedTable, setCleanedTable] = useState<any | null>(null);
  const [tableCleaning, setTableCleaning] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extracted Parsed Data State
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [adoptionSuccess, setAdoptionSuccess] = useState<string | null>(null);
  const [embedCodeCopied, setEmbedCodeCopied] = useState<boolean>(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setCleanedTable(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setTableCleaning(true);
      const res = await fetch(`${API_URL}/ai-importer/upload-file`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setTableData({ headers: data.headers, rows: data.rows });
        // Automatically clean Indian phone, dates, currency
        handleCleanTableData(data.headers, data.rows);
      } else {
        alert(data.detail || "Error reading CSV file");
      }
    } catch (err: any) {
      alert("Error uploading file: " + err.message);
    } finally {
      setTableCleaning(false);
    }
  };

  const handleCleanTableData = async (headers: string[], rows: any[]) => {
    setTableCleaning(true);
    try {
      const res = await fetch(`${API_URL}/ai-importer/parse-table`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headers,
          rows: rows.slice(0, 100),
          target_schema: "auto",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCleanedTable(data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setTableCleaning(false);
    }
  };

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
          inventory: parsedData.inventory,
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

  const EMBED_SNIPPET = `// ⚡ Embed DataCrew Importer in any Next.js / React app
import { DataCrewImporter } from "@datacrew/importer-react";

export function CustomerOnboarding() {
  return (
    <DataCrewImporter
      apiKey="dc_live_YOUR_API_KEY"
      theme="dark" // #0d0e12 Linear workbench
      targetSchema="invoices" // or "customers", "inventory"
      onComplete={(cleanRows, passport) => {
        console.log("Validated Data:", cleanRows);
        console.log("DPDP Compliance Certificate:", passport);
      }}
    />
  );
}`;

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#16171d] border border-[#292b35] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded bg-[#635bff]/10 border border-[#635bff]/20 text-[#635bff]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-base font-semibold text-[#f8fafc] tracking-tight">
              Embeddable AI Data Importer (The Flatfile Alternative)
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#635bff]/20 text-[#635bff] border border-[#635bff]/30">
              Killer Wedge #1
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] max-w-3xl">
            Drop messy CSV/Excel files or raw WhatsApp notes. Auto-normalizes Indian phone numbers (+91), converts DD/MM/YYYY dates to ISO, cleans currency symbols, and validates GSTIN schemas in seconds.
          </p>
        </div>

        {Array.isArray(businesses) && businesses.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-[#64748b]">Sync Target:</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-[#0d0e12] border border-[#292b35] rounded-md px-3 py-1.5 text-xs font-medium text-[#f8fafc] focus:outline-none"
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

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#292b35] pb-2">
        <button
          onClick={() => setIngestMode("csv")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            ingestMode === "csv"
              ? "bg-[#635bff] text-white"
              : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#16171d]"
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Messy CSV / Excel Dropzone</span>
        </button>
        <button
          onClick={() => setIngestMode("unstructured")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            ingestMode === "unstructured"
              ? "bg-[#635bff] text-white"
              : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#16171d]"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Raw Text & WhatsApp Parser</span>
        </button>
        <button
          onClick={() => setIngestMode("embed")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            ingestMode === "embed"
              ? "bg-[#635bff] text-white"
              : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#16171d]"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>B2B Embeddable SDK Code</span>
        </button>
      </div>

      {/* MODE 1: CSV / SPREADSHEET INGESTION */}
      {ingestMode === "csv" && (
        <div className="space-y-6">
          <div className="bg-[#16171d] border border-[#292b35] rounded-lg p-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.txt"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#292b35] hover:border-[#635bff] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#0d0e12]/60 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#1e2029] border border-[#292b35] flex items-center justify-center text-[#64748b] group-hover:text-[#635bff] transition-colors mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-[#f8fafc] mb-1">
                Drop your messy customer CSV or click to browse
              </div>
              <p className="text-xs text-[#64748b]">
                Supports Indian dates (DD/MM/YYYY), 10-digit mobile numbers with or without +91, and amounts in ₹
              </p>
              {csvFile && (
                <div className="mt-3 px-3 py-1 bg-[#1e2029] border border-[#292b35] rounded text-xs font-mono text-[#38bdf8]">
                  Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          </div>

          {/* Cleaned Table Grid (Airtable / Clay Style) */}
          {cleanedTable && (
            <div className="bg-[#16171d] border border-[#292b35] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold font-mono text-[#f8fafc] uppercase tracking-wider flex items-center gap-2">
                    <Table className="w-4 h-4 text-[#3ecf8e]" />
                    Cleaned Table Data Grid
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
                    {cleanedTable.corrections_count} Indian formatting auto-fixes applied
                  </span>
                </div>
                <div className="text-xs font-mono text-[#64748b]">
                  Showing {cleanedTable.rows.length} rows
                </div>
              </div>

              {/* Data Grid with JetBrains Mono numbers */}
              <div className="overflow-x-auto border border-[#292b35] rounded-md">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#12141a] text-[#94a3b8] uppercase text-[10px] tracking-wider border-b border-[#292b35]">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-[#64748b]">#</th>
                      {tableData?.headers.map((h) => (
                        <th key={h} className="py-2.5 px-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292b35]/60 bg-[#0d0e12]">
                    {cleanedTable.rows.slice(0, 15).map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#16171d] transition-colors">
                        <td className="py-2 px-3 text-[#64748b]">{idx + 1}</td>
                        {tableData?.headers.map((h) => (
                          <td key={h} className="py-2 px-3 text-[#cbd5e1] whitespace-nowrap">
                            {r[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: UNSTRUCTURED TEXT / WHATSAPP NOTES */}
      {ingestMode === "unstructured" && (
        <div className="space-y-6">
          <div className="bg-[#16171d] border border-[#292b35] rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold font-mono uppercase tracking-wider text-[#f8fafc] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#38bdf8]" /> Paste Raw Unstructured Business Notes
              </label>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[11px] text-[#64748b] font-mono">Try Sample:</span>
                <button
                  onClick={() => handleSampleClick(sample1)}
                  className="px-2.5 py-1 bg-[#1e2029] hover:bg-[#252833] text-[#f8fafc] border border-[#292b35] rounded text-[11px] font-mono"
                >
                  Restaurant Sample
                </button>
                <button
                  onClick={() => handleSampleClick(sample2)}
                  className="px-2.5 py-1 bg-[#1e2029] hover:bg-[#252833] text-[#f8fafc] border border-[#292b35] rounded text-[11px] font-mono"
                >
                  Salon / Spa Sample
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw WhatsApp messages, price notes, staff names, or customer invoices here..."
              className="w-full bg-[#0d0e12] border border-[#292b35] rounded-md p-3 text-xs font-mono text-[#f8fafc] focus:border-[#635bff] outline-none resize-none leading-relaxed"
            />

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !rawText.trim()}
              className="w-full py-2.5 bg-[#635bff] hover:bg-[#7a73ff] disabled:opacity-40 text-white font-medium text-xs rounded-md transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Parsing & Structuring in Progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extract & Structure with Groq AI</span>
                </>
              )}
            </button>
          </div>

          {/* Parsed Results Review */}
          {parsedData && (
            <div className="bg-[#16171d] border border-[#292b35] rounded-lg p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-[#292b35] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#3ecf8e]" />
                  <h2 className="text-sm font-semibold text-[#f8fafc] font-mono">
                    Extracted Schema Preview
                  </h2>
                </div>
                <button
                  onClick={handleAdoptData}
                  disabled={adopting}
                  className="px-4 py-2 bg-[#3ecf8e] hover:bg-[#34b77d] text-[#0d0e12] font-semibold text-xs rounded-md transition-all flex items-center gap-1.5"
                >
                  {adopting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing Database...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Adopt All Data into Business</span>
                    </>
                  )}
                </button>
              </div>

              {adoptionSuccess && (
                <div className="p-3 bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 rounded-md text-xs font-mono text-[#3ecf8e] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{adoptionSuccess}</span>
                </div>
              )}

              {/* Structured JSON Preview */}
              <div className="bg-[#0d0e12] border border-[#292b35] rounded-md p-4 text-xs font-mono text-[#cbd5e1] overflow-x-auto max-h-80 leading-relaxed">
                <pre>{JSON.stringify(parsedData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: B2B EMBEDDABLE COMPONENT CODE */}
      {ingestMode === "embed" && (
        <div className="bg-[#16171d] border border-[#292b35] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-[#f8fafc] font-mono flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#635bff]" />
                Embeddable React Component Integration
              </div>
              <p className="text-xs text-[#94a3b8]">
                Monetize as a standalone SaaS drop-in component ($99–$299/mo) for fintech, CRM, and logistics builders.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(EMBED_SNIPPET);
                setEmbedCodeCopied(true);
                setTimeout(() => setEmbedCodeCopied(false), 2000);
              }}
              className="px-3 py-1.5 bg-[#1e2029] hover:bg-[#252833] border border-[#292b35] rounded text-xs font-mono text-[#cbd5e1] flex items-center gap-1.5"
            >
              {embedCodeCopied ? <Check className="w-3.5 h-3.5 text-[#3ecf8e]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Component Code</span>
            </button>
          </div>

          <pre className="w-full bg-[#0d0e12] border border-[#292b35] rounded-md p-4 text-xs font-mono text-[#38bdf8] overflow-x-auto leading-relaxed">
            {EMBED_SNIPPET}
          </pre>
        </div>
      )}

    </div>
  );
}
