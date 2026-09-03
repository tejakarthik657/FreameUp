"use client";
import { TestimonialsVariantProps } from "./types";
export default function TestimonialsV1({ heading = "What People Say", items }: TestimonialsVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 32, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {items.map((t, i) => (
          <div key={i} style={{ border: "1px solid var(--border, #e5e7eb)", borderRadius: 14, padding: 24, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
            <p style={{ fontStyle: "italic", color: "var(--muted, #6b7280)", marginBottom: 12 }}>"{t.quote}"</p>
            <b style={{ fontSize: ".85rem" }}>— {t.author}{t.role ? `, ${t.role}` : ""}</b>
          </div>
        ))}
      </div>
    </div>
  );
}