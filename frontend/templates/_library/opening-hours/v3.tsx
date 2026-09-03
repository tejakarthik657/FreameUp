"use client";
import { OpeningHoursVariantProps } from "./types";
export default function OpeningHoursV3({ heading, rows }: OpeningHoursVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", padding: "60px 0" }}>
      <div className="container">
        <div style={{ maxWidth: 380, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "var(--accent, #D4AF37)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{heading}</h2>
          {rows.map((r, i) => <p key={i}>{r.label}: {r.value}</p>)}
        </div>
      </div>
    </div>
  );
}