"use client";
import { ContactFormVariantProps } from "./types";
const fieldStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", border: "1px solid var(--border, #e5e7eb)", borderRadius: 8, marginBottom: 14, fontFamily: "inherit" };
export default function ContactFormV2({ infoHeading = "Visit Us", infoText = "12 MG Road, Hyderabad\n+91 98765 43210", ctaLabel = "Send" }: ContactFormVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 48 }}>
      <div>
        <h2 style={{ fontSize: "1.8rem", color: "var(--primary, #8B4513)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{infoHeading}</h2>
        <p style={{ color: "var(--muted, #6b7280)", whiteSpace: "pre-line" }}>{infoText}</p>
      </div>
      <div>
        <input placeholder="Your name" style={fieldStyle} />
        <input placeholder="Phone" style={fieldStyle} />
        <textarea rows={4} placeholder="Message" style={fieldStyle} />
        <button style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--primary, #8B4513)", color: "#fff", border: "none", cursor: "pointer" }}>{ctaLabel}</button>
      </div>
    </div>
  );
}