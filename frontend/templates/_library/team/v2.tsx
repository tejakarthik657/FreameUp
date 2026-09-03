"use client";
import { TeamVariantProps } from "./types";
export default function TeamV2({ heading = "Meet the Team", members }: TeamVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 24, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {members.map((m, i) => (
          <div key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {m.imageUrl ? <img src={m.imageUrl} alt={m.name} style={{ borderRadius: "50%", width: 140, height: 140, objectFit: "cover", margin: "0 auto 14px" }} /> : <div aria-hidden="true" style={{ borderRadius: "50%", width: 140, height: 140, margin: "0 auto 14px", background: "var(--secondary, #f5e6d3)" }} />}
            <h3 style={{ fontFamily: "var(--font, serif)" }}>{m.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}