"use client";
import { TestimonialsVariantProps } from "./types";
export default function TestimonialsV3({ items }: TestimonialsVariantProps) {
  const t = items[0];
  if (!t) return null;
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", padding: "90px 0", textAlign: "center" }}>
      <div className="container">
        <p style={{ fontSize: "1.4rem", maxWidth: 640, margin: "0 auto 20px", color: "var(--accent, #D4AF37)", fontFamily: "var(--font, serif)" }}>"{t.quote}"</p>
        <b style={{ color: "#999" }}>— {t.author}{t.role ? `, ${t.role}` : ""}</b>
      </div>
    </div>
  );
}