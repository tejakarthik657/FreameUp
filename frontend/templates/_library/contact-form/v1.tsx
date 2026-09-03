"use client";
import { ContactFormVariantProps } from "./types";
const fieldStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", border: "1px solid var(--border, #e5e7eb)", borderRadius: 8, marginBottom: 14, fontFamily: "inherit" };
export default function ContactFormV1({ heading = "Get in Touch", ctaLabel = "Send Message" }: ContactFormVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.8rem", color: "var(--primary, #8B4513)", marginBottom: 24, textAlign: "center", fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <input placeholder="Your name" style={fieldStyle} />
      <input placeholder="Phone number" style={fieldStyle} />
      <textarea rows={4} placeholder="Message" style={fieldStyle} />
      <button style={{ width: "100%", display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--primary, #8B4513)", color: "#fff", border: "none", cursor: "pointer" }}>{ctaLabel}</button>
    </div>
  );
}