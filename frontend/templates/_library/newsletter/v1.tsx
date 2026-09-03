"use client";
import { NewsletterVariantProps } from "./types";
export default function NewsletterV1({ prompt, ctaLabel = "Subscribe" }: NewsletterVariantProps) {
  return (
    <div className="container" style={{ padding: "40px 0", background: "var(--secondary, #F5E6D3)", display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
      <span>{prompt}</span>
      <input placeholder="Your email" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border, #e5e7eb)" }} />
      <button style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--primary, #8B4513)", color: "#fff", border: "none", cursor: "pointer" }}>{ctaLabel}</button>
    </div>
  );
}