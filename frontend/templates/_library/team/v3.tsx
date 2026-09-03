"use client";
import { TeamVariantProps } from "./types";
export default function TeamV3({ heading = "Meet the Team", members }: TeamVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", padding: "80px 0" }}>
      <div className="container">
        <h2 style={{ color: "var(--accent, #D4AF37)", marginBottom: 20, fontFamily: "var(--font, serif)" }}>{heading}</h2>
        {members.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 0", borderBottom: "1px solid #333" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {m.imageUrl ? <img src={m.imageUrl} alt={m.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} /> : <div aria-hidden="true" style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--secondary, #f5e6d3)" }} />}
            <div>
              <h3 style={{ fontFamily: "var(--font, serif)" }}>{m.name}</h3>
              {m.role && <p style={{ color: "#999", fontSize: ".85rem" }}>{m.role}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}