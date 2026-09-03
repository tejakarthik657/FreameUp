"use client";
import { NewsletterVariantProps } from "./types";
export default function NewsletterV3({ heading = "Stay Updated", ctaLabel = "Subscribe" }: NewsletterVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", padding: "60px 0", textAlign: "center" }}>
      <div className="container">
        <h3 style={{ color: "var(--accent, #D4AF37)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{heading}</h3>
        <input placeholder="Your email" style={{ padding: "12px 16px", borderRadius: 8, border: "none", margin: "0 8px" }} />
        <button style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--accent, #D4AF37)", color: "#111", border: "none", cursor: "pointer" }}>{ctaLabel}</button>
      </div>
    </div>
  );
}