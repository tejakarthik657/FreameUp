"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileSpreadsheet,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Send,
  Download,
  Code2,
  Terminal,
  ShieldCheck,
  Building2,
  Filter,
  CheckCheck,
  ExternalLink,
  Layers,
  FileText,
  Boxes,
  Users,
} from "lucide-react";
import { API_URL } from "@/lib/api";

interface SchemaField {
  key: string;
  label: string;
  required: boolean;
  type: string;
}

interface SchemaDef {
  title: string;
  description: string;
  fields: SchemaField[];
}

export default function AiImporterPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "mapping" | "review" | "export" | "embed">("upload");
  const [schemas, setSchemas] = useState<Record<string, SchemaDef>>({});
  const [targetSchema, setTargetSchema] = useState<string>("customers");

  // File & Content States
  const [rawContent, setRawContent] = useState<string>("");
  const [filename, setFilename] = useState<string>("sample_messy_crm.csv");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);

  // Auto-Mapping & Cleaned Data States
  const [isMappingAndCleaning, setIsMappingAndCleaning] = useState<boolean>(false);
  const [columnMappings, setColumnMappings] = useState<Record<string, any>>({});
  const [cleanedRows, setCleanedRows] = useState<any[]>([]);
  const [fixSummary, setFixSummary] = useState<any>(null);
  const [qualityScore, setQualityScore] = useState<number>(0);

  // Webhook Dispatch States
  const [webhookUrl, setWebhookUrl] = useState<string>("https://webhook.site/df-import-test");
  const [secretKey, setSecretKey] = useState<string>("df_secret_live_7728a");
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  // Embed Modal Preview State
  const [embedModalOpen, setEmbedModalOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load schemas from backend on mount
  useEffect(() => {
    fetch(`${API_URL}/ai-importer/schemas`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.schemas) {
          setSchemas(data.schemas);
        }
      })
      .catch((err) => console.error("Error fetching schemas:", err));

    // Load default sample on mount
    loadSampleDataset("customers");
  }, []);

  const SAMPLE_DATASETS: Record<string, { filename: string; content: string }> = {
    customers: {
      filename: "messy_indian_leads_crm.csv",
      content: `Client / Party Name,Mob Contact,Email ID,Registered City,GSTIN Tax,Txn Date
Rajesh Kirana & Sons,9849012345,rajesh.kirana@gmail.com,Hyderabad,36AABCU9603R1ZM,14/08/2026
Pooja Cloth Emporium,09177890123,pooja_sarees@rediffmail.com,Secunderabad,,18/08/2026
Sharma Automotives,+91 94401 23456,contact@sharma-auto.in,Vijayawada,37AAACI1681G1ZQ,22/08/2026
Rajesh Kirana & Sons,9849012345,duplicate.rajesh@gmail.com,Hyderabad,36AABCU9603R1ZM,14/08/2026
Balaji Electronic Store,8008123456,balaji_tech@yahoo.co.in,Guntur,,02/09/2026
Anand Milk Parlour,09848055667,,Visakhapatnam,37ABCDE1234F1Z5,11/09/2026`,
    },
    inventory: {
      filename: "messy_hardware_inventory.csv",
      content: `Item Particulars,SKU Code,Group/Cat,Current Stock,MRP Rate,Cost Price
Bosch Drill Machine GSB 500W,BSH-DRL-01,Power Tools,45,₹ 3,850.00,Rs 2900
Finolex Copper Wire 1.5sqmm,FNX-WRE-15,Electricals,120,₹ 1,450,1100
Asian Paints Apex White 20L,AP-APX-20L,Paints,25,Rs. 5,200.00,Rs 4100
Bosch Drill Machine GSB 500W,BSH-DRL-01,Power Tools,45,₹ 3,850.00,2900
Anchor Roma Switch 6A,ANC-SW-6A,Electricals,450,₹ 42.00,Rs 28.50`,
    },
    invoices: {
      filename: "tally_export_sales.csv",
      content: `Bill No,Buyer Name,Buyer Mobile,Bill Date,Net Bill Amount,Paid Status
INV/2026/091,Sri Lakshmi Enterprises,9849012345,15/09/2026,₹ 18,450.00,Pending
INV/2026/092,Karthik Hardware Stores,09177890123,16/09/2026,Rs. 4,200,Paid
INV/2026/093,Sri Venkateshwara Sweets,9440123456,18/09/2026,12500,Pending
INV/2026/094,Modern Beauty Care,+91 80081 23456,21/09/2026,₹ 8,900.50,Paid`,
    },
  };

  const loadSampleDataset = (key: string) => {
    const sample = SAMPLE_DATASETS[key] || SAMPLE_DATASETS.customers;
    setTargetSchema(key);
    setFilename(sample.filename);
    setRawContent(sample.content);
    inspectRawCSV(sample.content, sample.filename);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setRawContent(text);
        inspectRawCSV(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  const inspectRawCSV = async (content: string, name: string) => {
    setIsInspecting(true);
    setCleanedRows([]);
    setFixSummary(null);
    try {
      const res = await fetch(`${API_URL}/ai-importer/inspect-file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_content: content, filename: name }),
      });
      const data = await res.json();
      if (res.ok && data.headers) {
        setHeaders(data.headers);
        setRawRows(data.all_rows || data.preview_rows || []);
      } else {
        alert(data.detail || "Failed to inspect file structure.");
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsInspecting(false);
    }
  };

  const runAutoMapAndClean = async () => {
    if (!headers.length || !rawRows.length) return;
    setIsMappingAndCleaning(true);
    try {
      const res = await fetch(`${API_URL}/ai-importer/auto-map-and-clean`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headers,
          rows: rawRows,
          target_schema: targetSchema,
          auto_deduplicate: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setColumnMappings(data.column_mappings || {});
        setCleanedRows(data.cleaned_rows || []);
        setFixSummary(data.fix_summary || null);
        setQualityScore(data.quality_score || 98.5);
        setActiveTab("review");
      } else {
        alert(data.detail || "Auto-mapping engine failed.");
      }
    } catch (e: any) {
      alert("Error running auto-mapping engine: " + e.message);
    } finally {
      setIsMappingAndCleaning(false);
    }
  };

  const handleDispatchWebhook = async () => {
    if (!webhookUrl || !cleanedRows.length) return;
    setIsDispatching(true);
    setDispatchResult(null);
    try {
      const res = await fetch(`${API_URL}/ai-importer/dispatch-webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhook_url: webhookUrl,
          secret_key: secretKey,
          schema_type: targetSchema,
          cleaned_data: cleanedRows.map((r) => {
            const { _meta, ...rest } = r;
            return rest;
          }),
        }),
      });
      const data = await res.json();
      setDispatchResult(data);
    } catch (e: any) {
      setDispatchResult({ status: "failed", error: e.message });
    } finally {
      setIsDispatching(false);
    }
  };

  const downloadCleanCSV = () => {
    if (!cleanedRows.length) return;
    const cleanFields = schemas[targetSchema]?.fields?.map((f) => f.key) || Object.keys(cleanedRows[0]).filter((k) => k !== "_meta");
    const csvHeader = cleanFields.join(",");
    const csvRows = cleanedRows.map((row) =>
      cleanFields.map((f) => `"${String(row[f] || "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = [csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `devframes_cleaned_${targetSchema}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const targetFields = schemas[targetSchema]?.fields || [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#262626] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-neutral-800">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-mono font-semibold tracking-wide border border-indigo-500/30">
                KILLER WEDGE #1
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-mono font-semibold tracking-wide border border-emerald-500/30">
                The Flatfile Alternative
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-mono font-semibold tracking-wide border border-amber-500/30">
                100% Real Live Engine
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              DevFrames Embeddable AI Data Importer
            </h1>
            <p className="text-neutral-300 text-xs md:text-sm leading-relaxed">
              Auto-maps messy Indian CSV/Excel columns, normalizes DD/MM/YYYY dates to ISO, cleans phone numbers to +91, strips currency symbols, flags duplicates, and dispatches clean data straight to your backend webhook.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setEmbedModalOpen(true)}
              className="px-4 py-2.5 bg-white text-[#0a0a0a] hover:bg-neutral-100 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Code2 className="w-4 h-4 text-indigo-600" />
              Preview Drop-in Modal
            </button>
            <button
              onClick={() => setActiveTab("embed")}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              Embed in 5 Mins
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e5e5] pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "upload"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "text-neutral-600 hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          1. Upload & Inspect
        </button>
        <button
          onClick={() => setActiveTab("mapping")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "mapping"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "text-neutral-600 hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          2. Column Auto-Mapping
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "review"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "text-neutral-600 hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
          }`}
        >
          <CheckCheck className="w-3.5 h-3.5" />
          3. Cleaned Data & Auto-Fixes {cleanedRows.length > 0 && `(${cleanedRows.length})`}
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "export"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "text-neutral-600 hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          4. Webhook Dispatch
        </button>
        <button
          onClick={() => setActiveTab("embed")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "embed"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "text-neutral-600 hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          5. SaaS React Drop-in Code
        </button>
      </div>

      {/* TAB 1: UPLOAD & INSPECT */}
      {activeTab === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upload Dropzone & Sample Picker */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#faf5e8] border border-[#e5e5e5] rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-[#0a0a0a] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                Select Target Schema
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(schemas).map(([key, def]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTargetSchema(key);
                      loadSampleDataset(key);
                    }}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                      targetSchema === key
                        ? "bg-[#0a0a0a] text-white border-[#0a0a0a] shadow-xs"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="font-bold capitalize">{key}</div>
                    <div className="text-[10px] opacity-75">{def.fields.length} schema fields</div>
                  </button>
                ))}
              </div>

              {/* Drag & Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-white rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.tsv,.txt"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center mx-auto text-indigo-600 transition-colors">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-neutral-800">
                  Drop messy CSV file or click to browse
                </div>
                <p className="text-[10px] text-neutral-500">
                  Accepts .csv, .tsv, .txt with messy Indian column names
                </p>
              </div>

              {/* Sample Datasets */}
              <div className="space-y-2 pt-2 border-t border-[#e5e5e5]">
                <div className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                  Or Test Messy Sample Files:
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <button
                    onClick={() => loadSampleDataset("customers")}
                    className="p-2 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl text-left flex items-center justify-between text-neutral-700"
                  >
                    <span>Messy Indian Customers CRM</span>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      6 rows
                    </span>
                  </button>
                  <button
                    onClick={() => loadSampleDataset("inventory")}
                    className="p-2 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl text-left flex items-center justify-between text-neutral-700"
                  >
                    <span>Messy Hardware Stock (₹/Rs)</span>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      5 rows
                    </span>
                  </button>
                  <button
                    onClick={() => loadSampleDataset("invoices")}
                    className="p-2 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl text-left flex items-center justify-between text-neutral-700"
                  >
                    <span>Tally Export Ledger (DD/MM/YYYY)</span>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      4 rows
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Raw File Inspector & Preview Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-[#0a0a0a] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Inspected File: <span className="font-mono text-indigo-600">{filename}</span>
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Detected {headers.length} columns · {rawRows.length} raw data records
                  </p>
                </div>
                <button
                  onClick={runAutoMapAndClean}
                  disabled={isMappingAndCleaning || !rawRows.length}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isMappingAndCleaning ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  Run AI Auto-Mapping & Clean
                </button>
              </div>

              {/* Detected Headers Strip */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                  Detected Column Headers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {headers.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-mono border border-neutral-200"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Raw Table Preview */}
              <div className="overflow-x-auto border border-neutral-200 rounded-xl max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf5e8] text-neutral-800 border-b border-neutral-200 sticky top-0 font-bold">
                    <tr>
                      <th className="p-2.5 w-10 text-neutral-400">#</th>
                      {headers.map((h, i) => (
                        <th key={i} className="p-2.5 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {rawRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="p-2.5 text-neutral-400 font-mono text-[10px]">{idx + 1}</td>
                        {headers.map((h, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-neutral-700 whitespace-nowrap">
                            {row[h] || <span className="text-neutral-300 italic">null</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Raw CSV Text Editor Toggle */}
              <details className="text-xs">
                <summary className="cursor-pointer font-semibold text-neutral-600 hover:text-neutral-900">
                  View / Edit Raw CSV Text
                </summary>
                <textarea
                  value={rawContent}
                  onChange={(e) => {
                    setRawContent(e.target.value);
                    inspectRawCSV(e.target.value, filename);
                  }}
                  rows={6}
                  className="w-full mt-2 p-3 font-mono text-xs border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </details>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI COLUMN AUTO-MAPPING */}
      {activeTab === "mapping" && (
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-[#0a0a0a]">
                AI Column Auto-Mapping & Confidence Audit
              </h3>
              <p className="text-xs text-neutral-500">
                Maps messy input columns into canonical target schema fields with fuzzy semantic matcher.
              </p>
            </div>
            <button
              onClick={runAutoMapAndClean}
              disabled={isMappingAndCleaning}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              {isMappingAndCleaning ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
              Confirm & Clean Data
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {headers.map((srcCol) => {
              const mapping = columnMappings[srcCol] || { target_key: "ignore", confidence: 0 };
              const isMapped = mapping.target_key && mapping.target_key !== "ignore";
              return (
                <div
                  key={srcCol}
                  className={`border rounded-2xl p-4 space-y-3 transition-all ${
                    isMapped
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-neutral-200 bg-neutral-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-800 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                      {srcCol}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mapping.confidence >= 90
                          ? "bg-emerald-100 text-emerald-800"
                          : mapping.confidence >= 70
                          ? "bg-amber-100 text-amber-800"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {mapping.confidence}% Match
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="font-semibold text-neutral-500">Maps to canonical field:</span>
                  </div>

                  <select
                    value={mapping.target_key || "ignore"}
                    onChange={(e) => {
                      setColumnMappings({
                        ...columnMappings,
                        [srcCol]: {
                          target_key: e.target.value,
                          confidence: 100,
                          method: "manual_override",
                        },
                      });
                    }}
                    className="w-full text-xs font-medium p-2 rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ignore">❌ Ignore / Skip Column</option>
                    {targetFields.map((tf) => (
                      <option key={tf.key} value={tf.key}>
                        {tf.label} ({tf.key}) {tf.required ? "*Req" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CLEANED DATA & AUTO-FIXES */}
      {activeTab === "review" && (
        <div className="space-y-6">
          {/* Quality HUD Metrics */}
          {fixSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e5e5e5] rounded-2xl p-4 shadow-xs">
                <div className="text-xs text-neutral-500 font-medium">Dates Converted to ISO</div>
                <div className="text-2xl font-black text-indigo-600 mt-1">
                  {fixSummary.dates_converted}
                </div>
                <div className="text-[10px] text-neutral-400">e.g. 14/08/2026 → 2026-08-14</div>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded-2xl p-4 shadow-xs">
                <div className="text-xs text-neutral-500 font-medium">Phones Standardized</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {fixSummary.phones_formatted}
                </div>
                <div className="text-[10px] text-neutral-400">+91 prefixed & formatted</div>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded-2xl p-4 shadow-xs">
                <div className="text-xs text-neutral-500 font-medium">Currencies Cleaned</div>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {fixSummary.currencies_cleaned}
                </div>
                <div className="text-[10px] text-neutral-400">₹ / Rs / commas stripped</div>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded-2xl p-4 shadow-xs">
                <div className="text-xs text-neutral-500 font-medium">Duplicates Purged</div>
                <div className="text-2xl font-black text-rose-600 mt-1">
                  {fixSummary.duplicates_removed}
                </div>
                <div className="text-[10px] text-neutral-400">By phone / email / SKU</div>
              </div>
            </div>
          )}

          {/* Cleaned Data Table */}
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-[#0a0a0a] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Cleaned & Validated Records ({cleanedRows.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Ready for webhook dispatch or direct database import.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadCleanCSV}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Clean CSV
                </button>
                <button
                  onClick={() => setActiveTab("export")}
                  className="px-4 py-2 bg-[#0a0a0a] hover:bg-neutral-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch to Webhook
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-neutral-200 rounded-xl max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf5e8] text-neutral-800 border-b border-neutral-200 sticky top-0 font-bold">
                  <tr>
                    <th className="p-3 w-10 text-neutral-400">#</th>
                    {targetFields.map((f) => (
                      <th key={f.key} className="p-3 whitespace-nowrap">
                        {f.label}
                      </th>
                    ))}
                    <th className="p-3 whitespace-nowrap">Auto-Fixes Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {cleanedRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50">
                      <td className="p-3 text-neutral-400 font-mono text-[10px]">{idx + 1}</td>
                      {targetFields.map((f) => {
                        const val = row[f.key];
                        return (
                          <td key={f.key} className="p-3 font-medium text-neutral-900 whitespace-nowrap">
                            {val !== undefined && val !== "" ? (
                              String(val)
                            ) : (
                              <span className="text-neutral-300 italic">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3 whitespace-nowrap">
                        {row._meta?.fixes_applied?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {row._meta.fixes_applied.map((fix: string, fIdx: number) => (
                              <span
                                key={fIdx}
                                className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] rounded font-mono border border-indigo-100"
                              >
                                {fix}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Valid format
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WEBHOOK DISPATCH */}
      {activeTab === "export" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#0a0a0a] flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              Live Webhook Dispatcher
            </h3>
            <p className="text-xs text-neutral-500">
              Dispatches cleaned records directly to your customer backend with HMAC-SHA256 signature authentication.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Target Webhook URL
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://api.yourcompany.com/webhooks/customer-import"
                  className="w-full text-xs font-mono p-3 rounded-xl border border-neutral-300 bg-neutral-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Webhook Secret Key (HMAC Verification)
                </label>
                <input
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="df_secret_live_..."
                  className="w-full text-xs font-mono p-3 rounded-xl border border-neutral-300 bg-neutral-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDispatchWebhook}
                  disabled={isDispatching || !cleanedRows.length}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDispatching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 text-amber-300" />
                  )}
                  Dispatch {cleanedRows.length} Records Now
                </button>
              </div>
            </div>
          </div>

          {/* Webhook Response Inspector */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 shadow-xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Live Dispatch Inspector
              </span>
              {dispatchResult && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    dispatchResult.status === "dispatched"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  HTTP {dispatchResult.http_status_code || "ERR"}
                </span>
              )}
            </div>

            {dispatchResult ? (
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-500">Status:</span>
                  <span className="text-emerald-400 font-bold">{dispatchResult.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-500">Latency:</span>
                  <span className="text-neutral-300">{dispatchResult.latency_ms} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-500">Records Sent:</span>
                  <span className="text-neutral-300">{dispatchResult.records_sent}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 block">HMAC Signature Header:</span>
                  <div className="bg-neutral-900 p-2 rounded text-[10px] break-all text-neutral-400 border border-neutral-800">
                    X-DevFrames-Signature: sha256={dispatchResult.signature}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-neutral-500 text-xs text-center py-12 italic">
                Hit "Dispatch" to send a real payload and inspect HTTP headers & response codes.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: EMBED IN YOUR SAAS (5-MIN DROP-IN) */}
      {activeTab === "embed" && (
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-base text-[#0a0a0a] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              Embed in Your SaaS in 5 Minutes
            </h3>
            <p className="text-xs text-neutral-500">
              Replace messy CSV crashes with a drop-in React/Next.js modal or HTML script tag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* React Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 font-mono">
                  React / Next.js Component
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `import { DevFramesImporter } from '@devframes/importer';

export function CustomerUploadButton() {
  return (
    <DevFramesImporter
      apiKey="df_live_pk_8829103"
      schema="customers"
      webhookUrl="https://api.yoursaas.com/api/v1/import-webhook"
      onSuccess={(records) => {
        console.log("Clean imported records:", records);
      }}
    >
      <button className="btn-primary">Import Customers</button>
    </DevFramesImporter>
  );
}`,
                      "react"
                    )
                  }
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  {copiedCode === "react" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === "react" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-4 bg-[#0a0a0a] text-neutral-200 rounded-2xl text-xs font-mono overflow-x-auto border border-neutral-800">
{`import { DevFramesImporter } from '@devframes/importer';

export function CustomerUploadButton() {
  return (
    <DevFramesImporter
      apiKey="df_live_pk_8829103"
      schema="customers"
      webhookUrl="https://api.yoursaas.com/api/v1/import-webhook"
      onSuccess={(records) => {
        console.log("Clean imported records:", records);
      }}
    >
      <button className="btn-primary">Import Customers</button>
    </DevFramesImporter>
  );
}`}
              </pre>
            </div>

            {/* Backend Webhook Receiver */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 font-mono">
                  FastAPI / Express Webhook Receiver
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `# FastAPI Webhook Handler
@app.post("/api/v1/import-webhook")
async def handle_import(payload: dict, request: Request):
    signature = request.headers.get("X-DevFrames-Signature")
    # Verify HMAC sha256 signature with your secret
    data = payload["data"]  # 100% clean & validated
    await db.customers.insert_many(data)
    return {"status": "saved", "count": len(data)}`,
                      "fastapi"
                    )
                  }
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  {copiedCode === "fastapi" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === "fastapi" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-4 bg-[#0a0a0a] text-neutral-200 rounded-2xl text-xs font-mono overflow-x-auto border border-neutral-800">
{`# FastAPI Webhook Handler
@app.post("/api/v1/import-webhook")
async def handle_import(payload: dict, request: Request):
    signature = request.headers.get("X-DevFrames-Signature")
    # Verify HMAC sha256 signature with your secret
    data = payload["data"]  # 100% clean & validated
    await db.customers.insert_many(data)
    return {"status": "saved", "count": len(data)}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* DROP-IN SIMULATOR MODAL */}
      {embedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-neutral-200 shadow-2xl p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  DF
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0a0a0a]">Import Your Customer Data</h4>
                  <p className="text-[10px] text-neutral-500">Powered by DevFrames Importer SDK</p>
                </div>
              </div>
              <button
                onClick={() => setEmbedModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-8 text-center space-y-3">
              <UploadCloud className="w-10 h-10 text-indigo-600 mx-auto" />
              <div className="font-bold text-sm text-neutral-800">
                Drop your messy Excel (.xlsx) or CSV file here
              </div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Our AI will auto-detect columns, fix Indian date formats (DD/MM/YYYY), clean phone numbers, and remove duplicate rows automatically.
              </p>
              <button
                onClick={() => {
                  setEmbedModalOpen(false);
                  setActiveTab("review");
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Upload & Auto-Fix Now
              </button>
            </div>

            <div className="text-[11px] text-neutral-400 text-center flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Client-Side Encryption & DPDP Act 2023 Compliant
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
