"use client";
import { ContactFormVariantProps } from "./types";
const fieldStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", border: "1px solid #333", background: "#111", color: "#fff", borderRadius: 8, marginBottom: 14, fontFamily: "inherit" };
export default function ContactFormV3({ heading = "Get in Touch", ctaLabel = "Send Message" }: ContactFormVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", padding: "80px 0" }}>
      <div className="container">
        <div style={{ maxWidth: 480, margin: "0 auto", background: "#1c1c1c", borderRadius: 16, padding: 36 }}>
          <h2 style={{ color: "#fff", fontSize: "1.6rem", marginBottom: 20, fontFamily: "var(--font, serif)" }}>{heading}</h2>
          <input placeholder="Your name" style={fieldStyle} />
          <textarea rows={3} placeholder="Message" style={fieldStyle} />
          <button style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--accent, #D4AF37)", color: "#111", border: "none", cursor: "pointer" }}>{ctaLabel}</button>
        </div>
      </div>
    </div>
  );
}