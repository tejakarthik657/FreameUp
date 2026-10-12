"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { API_URL } from "@/lib/api";

const SAMPLE_DIRTY_DATA = `Customer Ingestion Batch #4092:
1. Ramesh Sharma, Phone: 9849012345, Aadhaar: 4532 8901 2341, PAN: ABCDE1234F, Email: ramesh.sharma@gmail.com, API_Key: sk_live_9901429910
2. Priya Verma, Phone: +91 8765432109, Aadhaar: 9812 3456 7890, PAN: BLRPV9876K, Email: priya.v@outlook.com
3. Suresh Reddy, Phone: 07788990011, Aadhaar: 5544 3322 1100, PAN: HYDSR4321M, Password: SuperSecretPassword123!`;

export default function DpdpGatewayPage() {
  const [rawText, setRawText] = useState<string>(SAMPLE_DIRTY_DATA);
  const [sanitizing, setSanitizing] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [copiedClean, setCopiedClean] = useState<boolean>(false);
  const [copiedCert, setCopiedCert] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"diff" | "clean" | "certificate">("diff");

  const handleSanitize = async () => {
    if (!rawText.trim()) return;
    setSanitizing(true);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/dpdp/sanitize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_payload: rawText,
          masking_strategy: "redact",
          business_name: "FrameUp Enterprise Gateway",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.detail || "DPDP Sanitization failed");
      }
    } catch (e: any) {
      alert("Error contacting DPDP Sanitizer: " + e.message);
    } finally {
      setSanitizing(false);
    }
  };

  const copyToClipboard = (text: string, isCert: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isCert) {
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2000);
    } else {
      setCopiedClean(true);
      setTimeout(() => setCopiedClean(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#16171d] border border-[#292b35] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#635bff]/10 border border-[#635bff]/20 text-[#635bff]">
              <Lock className="w-4 h-4" />
            </div>
            <h1 className="text-base font-semibold text-[#f8fafc] tracking-tight">
              Enterprise DPDP & AI Data Sanitizer Gateway
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[#3ecf8e]">
              Statutory 2023 Shield
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] max-w-3xl">
            Deterministically scrub and tokenize Indian Personal Identifiable Information (Aadhaar, PAN, phone numbers, credentials) before feeding customer datasets to external AI models (OpenAI, Groq, Claude). Mitigates statutory DPDP penalties up to ₹250 Crore.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-[11px] font-mono text-[#64748b]">Max Penalty Protection</div>
            <div className="text-sm font-semibold font-mono text-[#ef4444]">₹250 Crore Shield</div>
          </div>
        </div>
      </div>

      {/* Main Dual Ingestion Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Raw Ingestion Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#16171d] border border-[#292b35] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f8fafc] uppercase tracking-wider font-mono flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
                1. Ingestion Payload
              </span>
              <button
                onClick={() => setRawText(SAMPLE_DIRTY_DATA)}
                className="text-[11px] text-[#38bdf8] hover:underline font-mono"
              >
                Load Sample Dirty Data
              </button>
            </div>

            <textarea
              rows={12}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste customer records, logs, WhatsApp notes with Aadhaar, PAN, or phone numbers..."
              className="w-full bg-[#0d0e12] border border-[#292b35] rounded-md p-3 text-xs font-mono text-[#cbd5e1] focus:border-[#635bff] outline-none resize-none leading-relaxed"
            />

            <button
              onClick={handleSanitize}
              disabled={sanitizing || !rawText.trim()}
              className="w-full py-2.5 px-4 bg-[#635bff] hover:bg-[#7a73ff] disabled:opacity-40 text-white font-medium text-xs rounded-md transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {sanitizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Deterministic PII Scrubbing in Progress...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3ecf8e]" />
                  <span>Sanitize & Issue DPDP Passport</span>
                </>
              )}
            </button>
          </div>

          {/* Compliance Checklist Cards */}
          <div className="bg-[#12141a] border border-[#292b35] rounded-lg p-4 space-y-2.5 text-xs text-[#94a3b8]">
            <div className="font-semibold text-[#f8fafc] text-xs font-mono">Guaranteed Masking Rules:</div>
            <div className="flex items-center justify-between text-[11px] py-1 border-b border-[#292b35]/60">
              <span className="text-[#cbd5e1]">12-Digit Indian Aadhaar Numbers</span>
              <span className="font-mono text-[#3ecf8e]">XXXX-XXXX-LAST4</span>
            </div>
            <div className="flex items-center justify-between text-[11px] py-1 border-b border-[#292b35]/60">
              <span className="text-[#cbd5e1]">10-Character Indian Income Tax PAN</span>
              <span className="font-mono text-[#3ecf8e]">ABXXXXX12F</span>
            </div>
            <div className="flex items-center justify-between text-[11px] py-1 border-b border-[#292b35]/60">
              <span className="text-[#cbd5e1]">10-Digit Mobile Numbers (+91)</span>
              <span className="font-mono text-[#3ecf8e]">+91-XXXXX-LAST4</span>
            </div>
            <div className="flex items-center justify-between text-[11px] py-1 border-b border-[#292b35]/60">
              <span className="text-[#cbd5e1]">Customer Emails & Domains</span>
              <span className="font-mono text-[#3ecf8e]">u***@domain.com</span>
            </div>
            <div className="flex items-center justify-between text-[11px] py-1">
              <span className="text-[#cbd5e1]">API Keys, Tokens & Passwords</span>
              <span className="font-mono text-[#ef4444]">[REDACTED_SECRET]</span>
            </div>
          </div>
        </div>

        {/* Right Column: Cleaned Output & Verifiable Data Passport */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Audit Summary Matrix Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#16171d] border border-[#292b35] p-3 rounded-lg">
                  <div className="text-[10px] font-mono text-[#64748b] uppercase">Aadhaar Masked</div>
                  <div className="text-lg font-bold font-mono text-[#3ecf8e]">
                    {result.passport.audit_matrix.aadhaar_numbers_masked}
                  </div>
                </div>
                <div className="bg-[#16171d] border border-[#292b35] p-3 rounded-lg">
                  <div className="text-[10px] font-mono text-[#64748b] uppercase">PAN Scrubbed</div>
                  <div className="text-lg font-bold font-mono text-[#3ecf8e]">
                    {result.passport.audit_matrix.pan_cards_masked}
                  </div>
                </div>
                <div className="bg-[#16171d] border border-[#292b35] p-3 rounded-lg">
                  <div className="text-[10px] font-mono text-[#64748b] uppercase">Phones / Emails</div>
                  <div className="text-lg font-bold font-mono text-[#38bdf8]">
                    {result.passport.audit_matrix.phone_numbers_redacted + result.passport.audit_matrix.emails_anonymized}
                  </div>
                </div>
                <div className="bg-[#16171d] border border-[#292b35] p-3 rounded-lg">
                  <div className="text-[10px] font-mono text-[#64748b] uppercase">Secrets Redacted</div>
                  <div className="text-lg font-bold font-mono text-[#ef4444]">
                    {result.passport.audit_matrix.secrets_stripped}
                  </div>
                </div>
              </div>

              {/* Data Passport Box (Supabase Emerald Border) */}
              <div className="bg-[#16171d] border border-[#3ecf8e]/30 rounded-lg p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-[#292b35] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-[#3ecf8e]/20 text-[#3ecf8e]">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold font-mono text-[#f8fafc]">
                        Data Passport Certificate
                      </div>
                      <div className="text-[10px] font-mono text-[#3ecf8e]">
                        {result.passport.certificate_id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(result.passport, null, 2), true)}
                      className="px-2.5 py-1 bg-[#1e2029] hover:bg-[#252833] border border-[#292b35] rounded text-[11px] font-mono text-[#cbd5e1] flex items-center gap-1.5"
                    >
                      {copiedCert ? <Check className="w-3 h-3 text-[#3ecf8e]" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Certificate</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[#64748b] text-[10px] block">ORIGINAL DATA SHA-256:</span>
                    <span className="text-[#94a3b8] text-[11px] break-all">{result.passport.original_data_hash}</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-[10px] block">CLEAN DATA SHA-256:</span>
                    <span className="text-[#3ecf8e] text-[11px] break-all">{result.passport.clean_data_hash}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#94a3b8] bg-[#0d0e12] p-2.5 rounded border border-[#292b35] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3ecf8e] shrink-0" />
                  <span>{result.passport.guarantee}</span>
                </div>
              </div>

              {/* View Output Tabs */}
              <div className="bg-[#16171d] border border-[#292b35] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#292b35] pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("diff")}
                      className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                        activeTab === "diff"
                          ? "bg-[#635bff] text-white"
                          : "text-[#94a3b8] hover:text-white"
                      }`}
                    >
                      Safe AI Payload
                    </button>
                    <button
                      onClick={() => setActiveTab("certificate")}
                      className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                        activeTab === "certificate"
                          ? "bg-[#635bff] text-white"
                          : "text-[#94a3b8] hover:text-white"
                      }`}
                    >
                      JSON Passport
                    </button>
                  </div>

                  <button
                    onClick={() => copyToClipboard(result.clean_payload)}
                    className="px-2.5 py-1 bg-[#1e2029] hover:bg-[#252833] border border-[#292b35] rounded text-[11px] font-mono text-[#cbd5e1] flex items-center gap-1.5"
                  >
                    {copiedClean ? <Check className="w-3 h-3 text-[#3ecf8e]" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Clean Text</span>
                  </button>
                </div>

                {activeTab === "diff" ? (
                  <pre className="w-full bg-[#0d0e12] border border-[#292b35] rounded-md p-3 text-xs font-mono text-[#3ecf8e] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
                    {result.clean_payload}
                  </pre>
                ) : (
                  <pre className="w-full bg-[#0d0e12] border border-[#292b35] rounded-md p-3 text-xs font-mono text-[#cbd5e1] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
                    {JSON.stringify(result.passport, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#16171d] border border-dashed border-[#292b35] rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-3 min-h-[420px]">
              <div className="w-12 h-12 rounded-full bg-[#1e2029] border border-[#292b35] flex items-center justify-center text-[#64748b]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-[#f8fafc]">Waiting for Ingestion Payload</div>
                <p className="text-xs text-[#64748b] max-w-sm">
                  Click &apos;Sanitize &amp; Issue DPDP Passport&apos; to deterministically scrub Aadhaar, PAN, phone numbers, and credentials with verifiable cryptographic proofs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
