"use client";
import { TestimonialsVariantProps } from "./types";
export default function TestimonialsV2({ items }: TestimonialsVariantProps) {
  const t = items[0];
  if (!t) return null;
  return (
    <div className="container" style={{ padding: "100px 0", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
      <p style={{ fontFamily: "var(--font, serif)", fontSize: "1.6rem", color: "var(--primary, #8B4513)", marginBottom: 20, lineHeight: 1.4 }}>"{t.quote}"</p>
      <b style={{ fontSize: ".9rem", color: "var(--muted, #6b7280)" }}>— {t.author}{t.role ? `, ${t.role}` : ""}</b>
    </div>
  );
}