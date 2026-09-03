"use client";
import { ContactFormVariantProps } from "./types";
export default function ContactFormV4({ ctaLabel = "Request a Quote" }: ContactFormVariantProps) {
  return (
    <div className="container" style={{ padding: "60px 0", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
      <input placeholder="Your name" style={{ padding: "12px 16px", border: "1px solid var(--border, #e5e7eb)", borderRadius: 8, flex: 1, minWidth: 200 }} />
      <input placeholder="Phone number" style={{ padding: "12px 16px", border: "1px solid var(--border, #e5e7eb)", borderRadius: 8, flex: 1, minWidth: 200 }} />
      <button style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--primary, #8B4513)", color: "#fff", border: "none", cursor: "pointer" }}>{ctaLabel}</button>
    </div>
  );
}