"use client";
import { TestimonialsVariantProps } from "./types";
export default function TestimonialsV4({ items }: TestimonialsVariantProps) {
  return (
    <div className="container" style={{ padding: "70px 0", maxWidth: 600, margin: "0 auto" }}>
      {items.map((t, i) => (
        <div key={i} style={{ display: "flex", gap: 16, padding: "18px 0", borderBottom: "1px solid var(--border, #e5e7eb)", alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--secondary, #F5E6D3)", flex: "0 0 auto" }} />
          <div>
            <p style={{ fontStyle: "italic" }}>"{t.quote}"</p>
            <b style={{ fontSize: ".8rem", color: "var(--muted, #6b7280)" }}>{t.author}{t.role ? `, ${t.role}` : ""}</b>
          </div>
        </div>
      ))}
    </div>
  );
}