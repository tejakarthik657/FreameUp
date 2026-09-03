"use client";
import { TeamVariantProps } from "./types";
export default function TeamV1({ heading = "Meet the Team", members }: TeamVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 24, textAlign: "center", fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "center" }}>
        {members.map((m, i) => (
          <div key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {m.imageUrl ? <img src={m.imageUrl} alt={m.name} style={{ borderRadius: 12, aspectRatio: 1, objectFit: "cover", marginBottom: 12, width: "100%", display: "block" }} /> : <div aria-hidden="true" style={{ aspectRatio: "1", borderRadius: 12, marginBottom: 12, background: "var(--secondary, #f5e6d3)" }} />}
            <h3 style={{ fontFamily: "var(--font, serif)" }}>{m.name}</h3>
            {m.role && <p style={{ color: "var(--muted, #6b7280)", fontSize: ".85rem" }}>{m.role}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}