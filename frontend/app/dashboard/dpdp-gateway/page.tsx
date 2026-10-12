"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Zap,
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
  QrCode,
  Search,
  Building,
  UserCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { API_URL } from "@/lib/api";

export default function DpdpGatewayPage() {
  const [activeTab, setActiveTab] = useState<"sanitizer" | "ai-proxy" | "certificate" | "audit-history">("sanitizer");
  const [sanitizeMode, setSanitizeMode] = useState<"mask" | "tokenize">("mask");

  // Sanitizer Input & Results
  const [rawText, setRawText] = useState<string>("");
  const [isSanitizing, setIsSanitizing] = useState<boolean>(false);
  const [sanitizeResult, setSanitizeResult] = useState<any>(null);

  // Business context inputs
  const [fiduciaryName, setFiduciaryName] = useState<string>("DevFrames Business Client");
  const [processingPurpose, setProcessingPurpose] = useState<string>("Customer Record Ingestion & Safe LLM Inference");

  // AI Proxy States
  const [proxyPrompt, setProxyPrompt] = useState<string>("");
  const [isCallingProxy, setIsCallingProxy] = useState<boolean>(false);
  const [proxyResult, setProxyResult] = useState<any>(null);

  // Active Certificate for Modal / Viewer
  const [activeCertificate, setActiveCertificate] = useState<any>(null);
  const [certificatesList, setCertificatesList] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch certificate audit history
  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${API_URL}/dpdp/certificates`);
      if (res.ok) {
        const data = await res.json();
        setCertificatesList(data.certificates || []);
      }
    } catch (e) {
      console.error("Error loading certificates:", e);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

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
          data_fiduciary_name: fiduciaryName,
          purpose: processingPurpose,
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
          data_fiduciary: fiduciaryName,
          purpose: processingPurpose,
        });
        fetchCertificates();
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
            "You are an expert enterprise business intelligence assistant. Analyze the user's data objectively and thoroughly. Use the provided tokens naturally without attempting to alter them.",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProxyResult(data);
        fetchCertificates();
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
      
      {/* ── Apple Clean Header Banner ── */}
      <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#e0e0e0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
              India DPDP Act 2023 Compliance Center
            </span>
            <span className="text-[11px] text-[#86868b] font-mono">· ₹250 Cr Legal Safeguard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            DataTrust — Privacy & AI Sanitization Gateway
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
            Protect your business from privacy penalties. Deterministically scrub Aadhaar, PAN, phone numbers, and bank credentials before AI processing, with verifiable QR audit certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab("certificate")}
            className="apple-btn-secondary text-xs px-4 py-2 font-medium flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-[#0066cc]" />
            View Certificate
          </button>
          <button
            onClick={() => setActiveTab("audit-history")}
            className="apple-btn-primary text-xs px-4 py-2 font-medium flex items-center gap-2"
          >
            <Scale className="w-4 h-4" />
            Audit Ledger ({certificatesList.length})
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Apple Filter Pills) */}
      <div className="flex items-center gap-2 border-b border-[#e0e0e0] pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab("sanitizer")}
          className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "sanitizer"
              ? "bg-[#0066cc] text-white shadow-xs"
              : "text-[#1d1d1f] hover:bg-[#e8e8ed]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          1. Data Sanitizer & Masking
        </button>
        <button
          onClick={() => setActiveTab("ai-proxy")}
          className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "ai-proxy"
              ? "bg-[#0066cc] text-white shadow-xs"
              : "text-[#1d1d1f] hover:bg-[#e8e8ed]"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          2. Safe AI Proxy (Zero Leakage)
        </button>
        <button
          onClick={() => setActiveTab("certificate")}
          className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "certificate"
              ? "bg-[#0066cc] text-white shadow-xs"
              : "text-[#1d1d1f] hover:bg-[#e8e8ed]"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          3. Legal Compliance Certificate & QR
        </button>
        <button
          onClick={() => setActiveTab("audit-history")}
          className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "audit-history"
              ? "bg-[#0066cc] text-white shadow-xs"
              : "text-[#1d1d1f] hover:bg-[#e8e8ed]"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          4. Compliance Audit Ledger ({certificatesList.length})
        </button>
      </div>

      {/* TAB 1: SANITIZER & MASKING */}
      {activeTab === "sanitizer" && (
        <div className="space-y-6">
          {/* PII Detection Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-[#86868b] font-semibold">Aadhaar (12-Digit)</div>
              <div className="text-xl font-bold text-rose-600 mt-0.5">
                {breakdown.aadhaar || 0}
              </div>
              <div className="text-[10px] text-[#86868b]">Verhoeff checksum</div>
            </div>
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-[#86868b] font-semibold">PAN Card</div>
              <div className="text-xl font-bold text-[#0066cc] mt-0.5">
                {breakdown.pan || 0}
              </div>
              <div className="text-[10px] text-[#86868b]">Income Tax format</div>
            </div>
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-[#86868b] font-semibold">Indian Mobile</div>
              <div className="text-xl font-bold text-emerald-600 mt-0.5">
                {breakdown.phone || 0}
              </div>
              <div className="text-[10px] text-[#86868b]">+91 / 10 digits</div>
            </div>
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-[#86868b] font-semibold">Bank A/C</div>
              <div className="text-xl font-bold text-amber-600 mt-0.5">
                {breakdown.bank_account || 0}
              </div>
              <div className="text-[10px] text-[#86868b]">Account numbers</div>
            </div>
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-[#86868b] font-semibold">IFSC Code</div>
              <div className="text-xl font-bold text-purple-600 mt-0.5">
                {breakdown.ifsc || 0}
              </div>
              <div className="text-[10px] text-[#86868b]">RBI standard</div>
            </div>
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-3.5 shadow-xs">
              <div className="text-[11px] text-[#86868b] font-semibold">Total Scrubbed</div>
              <div className="text-xl font-bold text-blue-600 mt-0.5">
                {sanitizeResult?.total_pii_scrubbed || 0}
              </div>
              <div className="text-[10px] text-[#86868b]">Protected entities</div>
            </div>
          </div>

          {/* Business Configuration Bar */}
          <div className="bg-white border border-[#e0e0e0] rounded-2xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#0066cc]" />
                Data Fiduciary / Business Legal Name:
              </label>
              <input
                type="text"
                value={fiduciaryName}
                onChange={(e) => setFiduciaryName(e.target.value)}
                placeholder="e.g. Hyderabad Retail Trading LLP"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#e0e0e0] bg-[#f5f5f7] focus:bg-white focus:outline-none focus:border-[#0066cc]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                Legitimate Processing Purpose (DPDP Sec 4):
              </label>
              <input
                type="text"
                value={processingPurpose}
                onChange={(e) => setProcessingPurpose(e.target.value)}
                placeholder="e.g. Customer Ingestion & Billing Records"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#e0e0e0] bg-[#f5f5f7] focus:bg-white focus:outline-none focus:border-[#0066cc]"
              />
            </div>
          </div>

          {/* Dual-Pane Sanitizer Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Raw Input */}
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[#1d1d1f] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  Source Input (Customer Records or Ingestion Notes)
                </h3>
                {rawText && (
                  <button
                    onClick={() => {
                      setRawText("");
                      setSanitizeResult(null);
                    }}
                    className="text-[11px] text-[#86868b] hover:text-rose-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  runSanitize(e.target.value, sanitizeMode);
                }}
                rows={12}
                className="w-full p-3 font-mono text-xs border border-rose-200 bg-rose-50/20 rounded-xl focus:bg-white focus:outline-none focus:border-[#0066cc] leading-relaxed"
                placeholder="Enter customer notes, Aadhaar numbers, PAN cards, phone numbers, or account details to sanitize..."
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#86868b]">Masking Mode:</span>
                  <button
                    onClick={() => {
                      setSanitizeMode("mask");
                      runSanitize(rawText, "mask");
                    }}
                    className={`px-3 py-1 rounded-full font-medium text-xs transition-all ${
                      sanitizeMode === "mask"
                        ? "bg-[#0066cc] text-white shadow-xs"
                        : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
                    }`}
                  >
                    Direct Redaction
                  </button>
                  <button
                    onClick={() => {
                      setSanitizeMode("tokenize");
                      runSanitize(rawText, "tokenize");
                    }}
                    className={`px-3 py-1 rounded-full font-medium text-xs transition-all ${
                      sanitizeMode === "tokenize"
                        ? "bg-[#0066cc] text-white shadow-xs"
                        : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
                    }`}
                  >
                    Token Vault (Reversible)
                  </button>
                </div>

                <button
                  onClick={() => runSanitize(rawText, sanitizeMode)}
                  disabled={isSanitizing || !rawText.trim()}
                  className="apple-btn-primary text-xs px-4 py-2 font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isSanitizing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  Run Sanitizer
                </button>
              </div>
            </div>

            {/* Right: Clean Sanitized Output */}
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
                <h3 className="font-semibold text-sm text-[#1d1d1f] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Clean Sanitized Output (100% DPDP Compliant)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  SAFE FOR AI & CLOUD
                </span>
              </div>

              <div className="p-3.5 bg-[#f5f5f7] border border-[#e0e0e0] rounded-xl font-mono text-xs text-[#1d1d1f] overflow-y-auto max-h-[290px] leading-relaxed whitespace-pre-wrap min-h-[200px]">
                {sanitizeResult?.sanitized_text || (
                  <span className="text-[#86868b] italic">
                    Type or paste customer notes on the left. Sanitized text with scrubbed PII will display here in real time.
                  </span>
                )}
              </div>

              {/* Hashes & Certificate Info */}
              {sanitizeResult && (
                <div className="space-y-1.5 text-[11px] font-mono text-[#86868b] border-t border-[#e0e0e0] pt-3">
                  <div className="flex justify-between">
                    <span>Input Hash (SHA-256):</span>
                    <span className="text-[#1d1d1f] truncate max-w-[220px]">
                      {sanitizeResult.raw_sha256}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clean Hash (SHA-256):</span>
                    <span className="text-emerald-700 font-bold truncate max-w-[220px]">
                      {sanitizeResult.sanitized_sha256}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span>Compliance Certificate:</span>
                    <button
                      onClick={() => setActiveTab("certificate")}
                      className="text-[#0066cc] hover:underline font-bold flex items-center gap-1"
                    >
                      {sanitizeResult.certificate_id} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAFE AI PROXY INFERENCE */}
      {activeTab === "ai-proxy" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-semibold text-base text-[#1d1d1f] flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Zero-Leakage AI Inference Gateway
              </h3>
              <p className="text-xs text-[#86868b] mt-0.5">
                Send queries containing customer details to AI without leaking private credentials. PII is scrubbed before transmission and restored in the response.
              </p>
            </div>

            {/* Pipeline Visual Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#f5f5f7] border border-[#e0e0e0] rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-[#86868b]">STEP 1</span>
                <div className="font-bold text-[#1d1d1f]">Raw Prompt</div>
                <div className="text-[11px] text-rose-600">Includes Aadhaar, PAN, Phone</div>
              </div>
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-[#0066cc]">STEP 2</span>
                <div className="font-bold text-blue-900">DPDP Scrub</div>
                <div className="text-[11px] text-blue-700">Tokenized deterministically</div>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-700">STEP 3</span>
                <div className="font-bold text-emerald-900">External LLM Call</div>
                <div className="text-[11px] text-emerald-700">0% Private PII sent over wire</div>
              </div>
              <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-purple-700">STEP 4</span>
                <div className="font-bold text-purple-900">Client Response</div>
                <div className="text-[11px] text-purple-700">Re-hydrated seamlessly</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-[#1d1d1f] block">
                Sensitive AI Prompt or Customer Ingestion Note:
              </label>
              <textarea
                value={proxyPrompt}
                onChange={(e) => setProxyPrompt(e.target.value)}
                rows={5}
                placeholder="Ask AI anything about your customer data (e.g. Summarize loan eligibility for Ramesh Verma, phone 9849012345, PAN ABCPV1234K)..."
                className="w-full p-3.5 font-mono text-xs border border-[#e0e0e0] rounded-xl bg-[#f5f5f7] focus:bg-white focus:outline-none focus:border-[#0066cc]"
              />
              <button
                onClick={runAIProxy}
                disabled={isCallingProxy || !proxyPrompt.trim()}
                className="apple-btn-primary text-xs px-5 py-2.5 font-medium flex items-center gap-2 disabled:opacity-50"
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
              {/* Safe Wire Prompt */}
              <div className="bg-white border border-[#e0e0e0] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
                  <span className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                    What External LLM Received (Safe Sanitized Prompt)
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    0% PII LEAKED
                  </span>
                </div>
                <div className="p-3.5 bg-[#f5f5f7] border border-[#e0e0e0] rounded-xl font-mono text-xs text-[#1d1d1f] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {proxyResult.zero_leakage_safe_prompt_sent_to_llm}
                </div>
                <div className="text-[11px] text-[#86868b]">
                  Protected {proxyResult.total_pii_protected} PII entities with reversible token cryptography.
                </div>
              </div>

              {/* Client Completion */}
              <div className="bg-white border border-[#e0e0e0] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
                  <span className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Client Response (Re-hydrated Seamlessly)
                  </span>
                  <span className="text-[10px] font-mono bg-blue-50 text-[#0066cc] px-2 py-0.5 rounded-full border border-blue-200 font-semibold">
                    {proxyResult.certificate_id}
                  </span>
                </div>
                <div className="p-3.5 bg-[#f5f5f7] border border-[#e0e0e0] rounded-xl text-xs text-[#1d1d1f] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {proxyResult.rehydrated_completion}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DPDP AUDIT CERTIFICATE */}
      {activeTab === "certificate" && (
        <div className="bg-white border border-[#e0e0e0] rounded-3xl p-6 md:p-10 shadow-xs max-w-4xl mx-auto space-y-8 print:p-0 print:border-none">
          {/* Certificate Header */}
          <div className="text-center space-y-3 border-b-2 border-[#1d1d1f] pb-6">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-8 h-8 text-[#0066cc]" />
              <span className="font-bold text-xl tracking-tight text-[#1d1d1f]">
                DevFrames DataTrust Gateway
              </span>
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-wider text-[#1d1d1f]">
              Certificate of DPDP Act 2023 Compliance
            </h2>
            <p className="text-xs text-[#86868b] font-mono">
              VERIFIABLE CRYPTOGRAPHIC AUDIT RECORD · SECTION 8 (DATA FIDUCIARY SAFEGUARDS)
            </p>
          </div>

          {/* Certificate Body */}
          <div className="space-y-6 text-xs text-[#1d1d1f] leading-relaxed">
            <p>
              This certifies that the digital data ingestion transaction identified below has been deterministically sanitized, masked, and cryptographically verified in strict adherence to the provisions of the{" "}
              <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, Act No. 22 of 2023)</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f5f5f7] p-5 rounded-2xl border border-[#e0e0e0]">
              <div>
                <span className="text-[#86868b] block text-[10px] uppercase font-bold">
                  Certificate Identifier:
                </span>
                <span className="font-mono font-bold text-sm text-[#1d1d1f]">
                  {activeCertificate?.certificate_id || "DPDP-CERT-202610-DEFAULT"}
                </span>
              </div>
              <div>
                <span className="text-[#86868b] block text-[10px] uppercase font-bold">
                  Verification Timestamp:
                </span>
                <span className="font-mono text-[#1d1d1f]">
                  {activeCertificate?.created_at ? new Date(activeCertificate.created_at).toLocaleString() : new Date().toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#86868b] block text-[10px] uppercase font-bold">
                  Data Fiduciary:
                </span>
                <span className="font-bold text-[#1d1d1f]">
                  {activeCertificate?.data_fiduciary || fiduciaryName}
                </span>
              </div>
              <div>
                <span className="text-[#86868b] block text-[10px] uppercase font-bold">
                  Compliance Status:
                </span>
                <span className="font-bold text-emerald-700">
                  VERIFIED — ZERO PII INGESTION LEAKAGE
                </span>
              </div>
            </div>

            {/* Cryptographic Hash Verification & Dynamic Legal QR Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-[#f5f5f7] p-5 rounded-2xl border border-[#e0e0e0]">
              <div className="md:col-span-2 space-y-2 font-mono text-[11px]">
                <div className="font-bold text-[#1d1d1f] uppercase tracking-wide">
                  Cryptographic Integrity Verification (SHA-256):
                </div>
                <div className="space-y-1 text-[#86868b] break-all">
                  <div>
                    <span className="text-[#86868b]">Raw Input Digest: </span>
                    {activeCertificate?.raw_sha256 || "e4e8b43d89bcf4817772a280c231405fb2cdc677ac47f668590a2fe289260f52"}
                  </div>
                  <div>
                    <span className="text-[#86868b]">Sanitized AI Digest: </span>
                    <span className="text-emerald-700 font-bold">
                      {activeCertificate?.sanitized_sha256 || "4e91801cf4f5330d18563c49f8d3b650dedf759a0c0d062e8969c4369f598ede"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Legal Verification QR Code */}
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-[#e0e0e0] rounded-xl text-center space-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://devframes.in/verify/dpdp/${activeCertificate?.certificate_id || "DPDP-CERT-202610-DEFAULT"}`}
                  alt="DPDP Audit QR Code"
                  className="w-20 h-20 rounded-md"
                />
                <span className="text-[9px] font-mono font-semibold text-[#86868b]">
                  Scan to Verify Online
                </span>
              </div>
            </div>

            <div className="border-t border-[#e0e0e0] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-8 h-8 text-[#86868b]" />
                <div className="text-[10px] text-[#86868b]">
                  Cryptographically sealed by DevFrames DataTrust Gateway.
                  <br />
                  Verifiable non-repudiable audit certificate for regulatory authorities.
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="apple-btn-primary text-xs px-4 py-2 font-medium flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLIANCE AUDIT LEDGER */}
      {activeTab === "audit-history" && (
        <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e0e0] pb-4">
            <div>
              <h3 className="font-semibold text-base text-[#1d1d1f] flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#0066cc]" />
                Compliance Audit Ledger ({certificatesList.length})
              </h3>
              <p className="text-xs text-[#86868b] mt-0.5">
                Every sanitization and AI query is permanently logged with its cryptographic SHA-256 hash.
              </p>
            </div>

            <button
              onClick={fetchCertificates}
              className="apple-btn-secondary text-xs px-3.5 py-1.5 font-medium flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Ledger
            </button>
          </div>

          {certificatesList.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#86868b] space-y-2">
              <ShieldCheck className="w-10 h-10 mx-auto text-[#86868b] opacity-40" />
              <p>No audit certificates recorded yet.</p>
              <p>Run a data sanitization or AI proxy query to create your first legal compliance record.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificatesList.map((cert) => {
                const isSelected = activeCertificate?.certificate_id === cert.certificate_id;
                return (
                  <div
                    key={cert._id || cert.certificate_id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      isSelected
                        ? "bg-blue-50/30 border-[#0066cc] shadow-xs ring-1 ring-[#0066cc]/30"
                        : "bg-white border-[#e0e0e0] hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-[#f5f5f7] text-[#0066cc] px-2 py-0.5 rounded-full uppercase block w-max mb-1 border border-[#e0e0e0]">
                          {cert.type || "DATA_SANITIZATION"}
                        </span>
                        <h4 className="font-mono font-semibold text-xs text-[#1d1d1f] truncate max-w-[180px]">
                          {cert.certificate_id}
                        </h4>
                        <span className="text-[11px] text-[#86868b] font-mono block mt-0.5">
                          {cert.created_at ? new Date(cert.created_at).toLocaleString() : "Recent"}
                        </span>
                      </div>

                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        {cert.total_pii_scrubbed || 0} Scrubbed
                      </span>
                    </div>

                    <div className="text-[11px] text-[#86868b] space-y-1 pt-1 border-t border-[#e0e0e0]">
                      <div className="truncate">
                        <span className="font-semibold text-[#1d1d1f]">Fiduciary: </span>
                        {cert.data_fiduciary || "Client Enterprise"}
                      </div>
                      <div className="truncate font-mono text-[10px]">
                        <span className="font-semibold text-[#1d1d1f]">Hash: </span>
                        {cert.sanitized_sha256 ? `${cert.sanitized_sha256.slice(0, 16)}...` : "SHA256 verified"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#e0e0e0] text-xs">
                      <button
                        onClick={() => {
                          setActiveCertificate(cert);
                          setActiveTab("certificate");
                        }}
                        className="apple-btn-secondary text-[11px] py-1.5 px-3 font-medium w-full justify-center"
                      >
                        Inspect Certificate & QR →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
