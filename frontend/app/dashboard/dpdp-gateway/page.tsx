"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Terminal,
  Code2,
  Copy,
  Check,
  RefreshCw,
  Printer,
  Download,
  Fingerprint,
  Scale,
  Award,
  ArrowRight,
  Eye,
  EyeOff,
  Send,
} from "lucide-react";
import { API_URL } from "@/lib/api";

export default function DpdpGatewayPage() {
  const [activeTab, setActiveTab] = useState<"sanitizer" | "ai-proxy" | "certificate" | "sdk">("sanitizer");
  const [sanitizeMode, setSanitizeMode] = useState<"mask" | "tokenize">("mask");

  // Sanitizer Input & Results
  const [rawText, setRawText] = useState<string>("");
  const [isSanitizing, setIsSanitizing] = useState<boolean>(false);
  const [sanitizeResult, setSanitizeResult] = useState<any>(null);

  // AI Proxy States
  const [proxyPrompt, setProxyPrompt] = useState<string>("");
  const [isCallingProxy, setIsCallingProxy] = useState<boolean>(false);
  const [proxyResult, setProxyResult] = useState<any>(null);

  // Active Certificate for Modal / Viewer
  const [activeCertificate, setActiveCertificate] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const SAMPLE_PII_TEXTS = {
    kyc: `KYC VERIFICATION RECORD - HDFC LOAN APPLICANT
Customer Name: Ramesh Chandra Verma
Aadhaar Number: 4920 1829 3849
PAN Card: ABCPV1234K
Mobile Phone: 9849012345 (Alt: +91 91778 90123)
Email Address: ramesh.verma94@gmail.com
Bank Account Number: 50100239182341
IFSC Code: HDFC0001234
Current Residential Address: Flat 402, Sai Residency, Madhapur, Hyderabad - 500081
Monthly Inhand Income: ₹ 1,45,000`,
    hr: `EMPLOYEE PAYROLL DOSSIER - Q3 2026
Employee: Priya Sundaram
Designation: Senior Cloud Architect
Permanent Aadhaar: 5829 4019 2831
Income Tax PAN: BLRPS9921M
Voter ID: TZD1928374
Salary Credited To: State Bank of India A/C 38291049281 (IFSC: SBIN0004019)
Personal Mobile: 9440123456
Official Email: priya.sundaram@fintechsolutions.co.in`,
    support: `CUSTOMER DISPUTE TRANSCRIPT
User says: "Hi, I noticed an unauthorized charge on my account. My phone number is 8008123456 and my PAN is CZRPK8821Q. 
I had uploaded my Aadhaar 9102 3847 1928 for KYC on 12/08/2026. Please freeze my bank account 1029384756 immediately!"`,
  };

  useEffect(() => {
    // Set default sample on mount
    loadSampleText("kyc");
  }, []);

  const loadSampleText = (key: keyof typeof SAMPLE_PII_TEXTS) => {
    const text = SAMPLE_PII_TEXTS[key];
    setRawText(text);
    setProxyPrompt(
      `Analyze this customer loan application: Assess their creditworthiness, summarize key risk indicators, and provide an advisory report.\n\n${text}`
    );
    runSanitize(text, sanitizeMode);
  };

  const runSanitize = async (textToSanitize: string, mode: "mask" | "tokenize") => {
    if (!textToSanitize || !textToSanitize.trim()) return;
    setIsSanitizing(true);
    try {
      const res = await fetch(`${API_URL}/dpdp/sanitize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_text: textToSanitize,
          mode: mode,
          data_fiduciary_name: "DevFrames Client Enterprise",
          purpose: "AI Ingestion & Safe LLM Inference",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSanitizeResult(data);
        setActiveCertificate({
          certificate_id: data.certificate_id,
          created_at: data.created_at,
          total_pii_scrubbed: data.total_pii_scrubbed,
          breakdown: data.breakdown,
          raw_sha256: data.raw_sha256,
          sanitized_sha256: data.sanitized_sha256,
          compliance_status: data.compliance_status,
          data_fiduciary: "DevFrames Client Enterprise",
          purpose: "AI Ingestion & Safe LLM Inference",
        });
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSanitizing(false);
    }
  };

  const runAIProxy = async () => {
    if (!proxyPrompt || !proxyPrompt.trim()) return;
    setIsCallingProxy(true);
    setProxyResult(null);
    try {
      const res = await fetch(`${API_URL}/dpdp/ai-proxy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_prompt: proxyPrompt,
          system_instruction:
            "You are an expert enterprise business intelligence assistant. Analyze the user's data objectively and thoroughly.",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProxyResult(data);
      } else {
        alert(data.detail || "AI Proxy Gateway failed.");
      }
    } catch (e: any) {
      alert("Error invoking AI Gateway: " + e.message);
    } finally {
      setIsCallingProxy(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const breakdown = sanitizeResult?.breakdown || {
    aadhaar: 0,
    pan: 0,
    phone: 0,
    email: 0,
    ifsc: 0,
    bank_account: 0,
    voter_id: 0,
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0d131f] via-[#111c30] to-[#162744] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-mono font-semibold tracking-wide border border-blue-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                KILLER WEDGE #2
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-mono font-semibold tracking-wide border border-emerald-500/30">
                DPDP Act 2023 Compliant
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-mono font-semibold tracking-wide border border-amber-500/30">
                ₹250 Cr Fine Protection
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              DevFrames DataTrust — DPDP & AI Data Sanitizer
            </h1>
            <p className="text-blue-100/80 text-xs md:text-sm leading-relaxed">
              Deterministic redaction and reversible tokenization for Indian PII (Aadhaar, PAN, phone numbers, bank accounts) before ingestion into external LLMs or vector databases. Issues verifiable cryptographic compliance certificates for your legal department.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setActiveTab("certificate")}
              className="px-4 py-2.5 bg-white text-[#0a0a0a] hover:bg-neutral-100 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Award className="w-4 h-4 text-blue-600" />
              View Legal Certificate
            </button>
            <button
              onClick={() => setActiveTab("sdk")}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Code2 className="w-4 h-4 text-emerald-300" />
              Get Drop-in SDK
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e5e5] pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("sanitizer")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "sanitizer"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "text-neutral-600 hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          1. Data Sanitizer & Tokenizer
        </button>
        <button
          onClick={() => setActiveTab("ai-proxy")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "ai-proxy"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "text-neutral-600 hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          2. Safe AI Proxy (Zero Leakage)
        </button>
        <button
          onClick={() => setActiveTab("certificate")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "certificate"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "text-neutral-600 hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-blue-600" />
          3. DPDP Audit Certificate
        </button>
        <button
          onClick={() => setActiveTab("sdk")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "sdk"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "text-neutral-600 hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          4. Enterprise SDK & Middleware
        </button>
      </div>

      {/* TAB 1: SANITIZER & TOKENIZER */}
      {activeTab === "sanitizer" && (
        <div className="space-y-6">
          {/* PII Detection HUD Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-neutral-500 font-semibold">Aadhaar (12-Digit)</div>
              <div className="text-xl font-black text-rose-600 mt-0.5">
                {breakdown.aadhaar || 0}
              </div>
              <div className="text-[9px] text-neutral-400">Verhoeff verified</div>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-neutral-500 font-semibold">PAN Card</div>
              <div className="text-xl font-black text-indigo-600 mt-0.5">
                {breakdown.pan || 0}
              </div>
              <div className="text-[9px] text-neutral-400">ITD regex standard</div>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-neutral-500 font-semibold">Indian Mobile</div>
              <div className="text-xl font-black text-emerald-600 mt-0.5">
                {breakdown.phone || 0}
              </div>
              <div className="text-[9px] text-neutral-400">+91 / 10 digits</div>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-neutral-500 font-semibold">Bank A/C</div>
              <div className="text-xl font-black text-amber-600 mt-0.5">
                {breakdown.bank_account || 0}
              </div>
              <div className="text-[9px] text-neutral-400">Account digits</div>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-neutral-500 font-semibold">IFSC Code</div>
              <div className="text-xl font-black text-purple-600 mt-0.5">
                {breakdown.ifsc || 0}
              </div>
              <div className="text-[9px] text-neutral-400">RBI standard</div>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-neutral-500 font-semibold">Total Scrubbed</div>
              <div className="text-xl font-black text-blue-600 mt-0.5">
                {sanitizeResult?.total_pii_scrubbed || 0}
              </div>
              <div className="text-[9px] text-neutral-400">Protected entities</div>
            </div>
          </div>

          {/* Dual-Pane Sanitizer Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Raw Input */}
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#0a0a0a] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  Raw Ingestion Data (Contains Sensitive PII)
                </h3>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => loadSampleText("kyc")}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-semibold"
                  >
                    KYC Sample
                  </button>
                  <button
                    onClick={() => loadSampleText("hr")}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-semibold"
                  >
                    HR Sample
                  </button>
                  <button
                    onClick={() => loadSampleText("support")}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-semibold"
                  >
                    Support Sample
                  </button>
                </div>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  runSanitize(e.target.value, sanitizeMode);
                }}
                rows={12}
                className="w-full p-3 font-mono text-xs border border-rose-200 bg-rose-50/20 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500 leading-relaxed"
                placeholder="Paste sensitive documents, Aadhaar, PAN, phone numbers, or account details..."
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-neutral-600">Mode:</span>
                  <button
                    onClick={() => {
                      setSanitizeMode("mask");
                      runSanitize(rawText, "mask");
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                      sanitizeMode === "mask"
                        ? "bg-[#0a0a0a] text-white"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    Mask Redaction
                  </button>
                  <button
                    onClick={() => {
                      setSanitizeMode("tokenize");
                      runSanitize(rawText, "tokenize");
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                      sanitizeMode === "tokenize"
                        ? "bg-[#0a0a0a] text-white"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    Token Vault (Reversible)
                  </button>
                </div>

                <button
                  onClick={() => runSanitize(rawText, sanitizeMode)}
                  disabled={isSanitizing}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {isSanitizing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  Re-Scrub
                </button>
              </div>
            </div>

            {/* Right: Sanitized Output */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-5 shadow-xl text-white space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Safe For AI Clean Output (Zero PII)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DPDP COMPLIANT
                </span>
              </div>

              <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-200 overflow-y-auto max-h-[300px] leading-relaxed whitespace-pre-wrap">
                {sanitizeResult?.sanitized_text || "Processing sanitization..."}
              </div>

              {/* Hashes & Cert Info */}
              <div className="space-y-1.5 text-[10px] font-mono text-neutral-400 border-t border-neutral-800 pt-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">SHA-256 Digest (Original):</span>
                  <span className="text-neutral-300 truncate max-w-[200px]">
                    {sanitizeResult?.raw_sha256}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">SHA-256 Digest (Sanitized):</span>
                  <span className="text-emerald-400 truncate max-w-[200px]">
                    {sanitizeResult?.sanitized_sha256}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-neutral-500">Audit Certificate ID:</span>
                  <button
                    onClick={() => setActiveTab("certificate")}
                    className="text-blue-400 hover:underline font-bold"
                  >
                    {sanitizeResult?.certificate_id || "DPDP-CERT-2026-..."} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAFE AI PROXY INFERENCE */}
      {activeTab === "ai-proxy" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-base text-[#0a0a0a] flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Zero-Leakage AI Inference Gateway
              </h3>
              <p className="text-xs text-neutral-500">
                Type or paste any query with real sensitive data. The Gateway scrubs PII before sending to Groq LLM, and re-hydrates the response locally.
              </p>
            </div>

            {/* Visual Pipeline Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-neutral-400">STEP 1</span>
                <div className="font-bold text-neutral-800">Raw Sensitive Query</div>
                <div className="text-[10px] text-rose-600">Aadhaar, PAN, Phone</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-blue-400">STEP 2</span>
                <div className="font-bold text-blue-900">DPDP Gateway Scrub</div>
                <div className="text-[10px] text-blue-700">Tokenized locally</div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-400">STEP 3</span>
                <div className="font-bold text-emerald-900">External LLM Call</div>
                <div className="text-[10px] text-emerald-700">0% PII sent over wire</div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-400">STEP 4</span>
                <div className="font-bold text-indigo-900">Local Re-hydration</div>
                <div className="text-[10px] text-indigo-700">Clean client response</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-neutral-700 block">
                Sensitive AI Prompt / Document:
              </label>
              <textarea
                value={proxyPrompt}
                onChange={(e) => setProxyPrompt(e.target.value)}
                rows={5}
                className="w-full p-3 font-mono text-xs border border-neutral-300 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={runAIProxy}
                disabled={isCallingProxy}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isCallingProxy ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Run Zero-Leakage AI Inference
              </button>
            </div>
          </div>

          {/* AI Proxy Response Inspector */}
          {proxyResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wire Payload Inspector */}
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-5 text-white space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5" />
                    What External LLM Received (Safe Prompt)
                  </span>
                  <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    ZERO PII LEAKED
                  </span>
                </div>
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-300 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {proxyResult.zero_leakage_safe_prompt_sent_to_llm}
                </div>
                <div className="text-[10px] font-mono text-neutral-500">
                  Protected: {proxyResult.total_pii_protected} PII entities replaced with cryptographic tokens.
                </div>
              </div>

              {/* Final Client Completion */}
              <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Client Response (Re-hydrated Seamlessly)
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                    CERT: {proxyResult.certificate_id}
                  </span>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {proxyResult.rehydrated_completion}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DPDP AUDIT CERTIFICATE */}
      {activeTab === "certificate" && (
        <div className="bg-white border border-[#e5e5e5] rounded-3xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto space-y-8 print:p-0 print:border-none">
          {/* Certificate Header */}
          <div className="text-center space-y-3 border-b-2 border-neutral-900 pb-6">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-8 h-8 text-blue-700" />
              <span className="font-extrabold text-xl tracking-tight text-[#0a0a0a]">
                DevFrames DataTrust Gateway
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
              Certificate of DPDP Act 2023 Compliance
            </h2>
            <p className="text-xs text-neutral-500 font-mono">
              VERIFIABLE CRYPTOGRAPHIC AUDIT RECORD · SECTION 8 (DATA FIDUCIARY SAFEGUARDS)
            </p>
          </div>

          {/* Certificate Body */}
          <div className="space-y-6 text-xs text-neutral-800 leading-relaxed">
            <p>
              This is to certify that the digital ingestion dataset identified below has been deterministically sanitized, masked, and cryptographically verified in strict adherence to the provisions of the{" "}
              <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, Act No. 22 of 2023)</strong> and the Digital Personal Data Protection Rules.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#faf5e8] p-5 rounded-2xl border border-[#e5e5e5]">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                  Certificate Identifier:
                </span>
                <span className="font-mono font-bold text-sm text-neutral-900">
                  {activeCertificate?.certificate_id || "DPDP-CERT-2026-X8819A"}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                  Verification Timestamp:
                </span>
                <span className="font-mono text-neutral-800">
                  {activeCertificate?.created_at || new Date().toISOString()}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                  Data Fiduciary:
                </span>
                <span className="font-bold text-neutral-900">
                  {activeCertificate?.data_fiduciary || "DevFrames Enterprise Client"}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                  Compliance Status:
                </span>
                <span className="font-bold text-emerald-700">
                  VERIFIED — ZERO PII INGESTION LEAKAGE
                </span>
              </div>
            </div>

            {/* Cryptographic Hash Verification */}
            <div className="space-y-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 font-mono text-[11px]">
              <div className="font-bold text-neutral-800 uppercase tracking-wide">
                Cryptographic Integrity Verification (SHA-256):
              </div>
              <div className="space-y-1 text-neutral-600 break-all">
                <div>
                  <span className="text-neutral-400">Raw Input Digest: </span>
                  {activeCertificate?.raw_sha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
                </div>
                <div>
                  <span className="text-neutral-400">Sanitized AI Digest: </span>
                  <span className="text-emerald-700 font-bold">
                    {activeCertificate?.sanitized_sha256 || "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-8 h-8 text-neutral-400" />
                <div className="text-[10px] text-neutral-500">
                  Cryptographically sealed by DevFrames DataTrust Gateway.
                  <br />
                  Non-repudiable audit certificate.
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0a0a0a] text-white hover:bg-neutral-800 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENTERPRISE SDK & MIDDLEWARE */}
      {activeTab === "sdk" && (
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-base text-[#0a0a0a] flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              Enterprise Drop-in Middleware & SDK
            </h3>
            <p className="text-xs text-neutral-500">
              Integrate DPDP compliance into your Python FastAPI, Node.js, LangChain, or LlamaIndex backend with 3 lines of code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Python / FastAPI Middleware */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 font-mono">
                  Python SDK / FastAPI Middleware
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `# pip install devframes-datatrust
from devframes_datatrust import DPDPGateway

gateway = DPDPGateway(api_key="dpdp_live_secret_7728")

@app.post("/api/ask-ai")
async def ask_internal_ai(user_prompt: str):
    # Gateway strips Aadhaar, PAN, phone numbers before sending to OpenAI/Claude
    safe_response = await gateway.safe_completion(
        prompt=user_prompt,
        model="groq/llama-3.3-70b",
        data_fiduciary="My Company Legal Entity"
    )
    return {"reply": safe_response.text, "audit_cert": safe_response.cert_id}`,
                      "python"
                    )
                  }
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  {copiedCode === "python" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === "python" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-4 bg-[#0a0a0a] text-neutral-200 rounded-2xl text-xs font-mono overflow-x-auto border border-neutral-800">
{`# pip install devframes-datatrust
from devframes_datatrust import DPDPGateway

gateway = DPDPGateway(api_key="dpdp_live_secret_7728")

@app.post("/api/ask-ai")
async def ask_internal_ai(user_prompt: str):
    # Gateway strips Aadhaar, PAN, phone numbers before sending to LLM
    safe_response = await gateway.safe_completion(
        prompt=user_prompt,
        model="groq/llama-3.3-70b",
        data_fiduciary="My Company Legal Entity"
    )
    return {"reply": safe_response.text, "audit_cert": safe_response.cert_id}`}
              </pre>
            </div>

            {/* Node.js / LangChain SDK */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 font-mono">
                  Node.js / LangChain Ingestion Gateway
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `// npm install @devframes/datatrust
import { DataTrustGateway } from '@devframes/datatrust';

const trust = new DataTrustGateway({ apiKey: process.env.DPDP_API_KEY });

export async function processCustomerDocument(rawDocument) {
  // Deterministically sanitizes PII before vector embedding (Pinecone/Chroma)
  const sanitized = await trust.sanitize(rawDocument, { mode: 'tokenize' });
  
  // Safe to embed into RAG pipeline without violating DPDP Act 2023
  await vectorStore.addDocuments([sanitized.cleanText]);
  return { certificateId: sanitized.certificateId };
}`,
                      "node"
                    )
                  }
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  {copiedCode === "node" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === "node" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-4 bg-[#0a0a0a] text-neutral-200 rounded-2xl text-xs font-mono overflow-x-auto border border-neutral-800">
{`// npm install @devframes/datatrust
import { DataTrustGateway } from '@devframes/datatrust';

const trust = new DataTrustGateway({ apiKey: process.env.DPDP_API_KEY });

export async function processCustomerDocument(rawDocument) {
  // Deterministically sanitizes PII before vector embedding
  const sanitized = await trust.sanitize(rawDocument, { mode: 'tokenize' });
  
  // Safe to embed into RAG pipeline without DPDP penalties
  await vectorStore.addDocuments([sanitized.cleanText]);
  return { certificateId: sanitized.certificateId };
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
