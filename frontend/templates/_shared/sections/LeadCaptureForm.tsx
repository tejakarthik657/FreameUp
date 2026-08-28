"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

interface LeadCaptureFormProps {
  businessId: string;
  themePrimaryColor?: string; // used for button highlights, e.g. bg-[var(--theme-accent)]
  buttonClassName?: string;
  inputClassName?: string;
}

export function LeadCaptureForm({
  businessId,
  themePrimaryColor,
  buttonClassName = "",
  inputClassName = "",
}: LeadCaptureFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: message || undefined,
          business_id: businessId,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Lead submission failed");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-emerald-50/50 border border-emerald-200/50 rounded-2xl animate-fade-in text-slate-800">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3 animate-bounce" />
        <h4 className="font-bold text-lg text-emerald-900 mb-1">Quote Request Sent!</h4>
        <p className="text-sm text-slate-600 max-w-sm">
          Thank you for reaching out. We have received your request and will contact you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-xs font-semibold underline text-slate-600 hover:text-slate-800"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80" htmlFor="lead-name">
          Full Name *
        </label>
        <input
          id="lead-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className={`w-full px-4 py-3 text-sm rounded-xl border border-current/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${inputClassName}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80" htmlFor="lead-email">
            Email Address *
          </label>
          <input
            id="lead-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className={`w-full px-4 py-3 text-sm rounded-xl border border-current/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${inputClassName}`}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80" htmlFor="lead-phone">
            Phone Number *
          </label>
          <input
            id="lead-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className={`w-full px-4 py-3 text-sm rounded-xl border border-current/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${inputClassName}`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80" htmlFor="lead-message">
          Message / Special Requests
        </label>
        <textarea
          id="lead-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about what you need..."
          className={`w-full px-4 py-3 text-sm rounded-xl border border-current/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${inputClassName}`}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
          buttonClassName || "bg-indigo-600 hover:bg-indigo-500"
        }`}
        style={themePrimaryColor ? { backgroundColor: themePrimaryColor } : {}}
      >
        {submitting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <span>Submit Request</span>
            <Send className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
