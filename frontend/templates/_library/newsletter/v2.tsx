"use client";
import { NewsletterVariantProps } from "./types";
export default function NewsletterV2({ heading = "Stay Updated", ctaLabel = "Subscribe" }: NewsletterVariantProps) {
  return (
    <div className="container" style={{ padding: "60px 0" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", border: "1px solid var(--border, #e5e7eb)", borderRadius: 14, padding: 24, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <h3 style={{ fontFamily: "var(--font, serif)" }}>{heading}</h3>
        <input placeholder="Your email" style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border, #e5e7eb)", borderRadius: 8, margin: "16px 0" }} />
        <button style={{ width: "100%", display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--primary, #8B4513)", color: "#fff", border: "none", cursor: "pointer" }}>{ctaLabel}</button>
      </div>
    </div>
  );
}