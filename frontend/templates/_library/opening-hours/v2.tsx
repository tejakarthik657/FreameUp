"use client";
import { OpeningHoursVariantProps } from "./types";
export default function OpeningHoursV2({ heading, rows }: OpeningHoursVariantProps) {
  return (
    <div className="container" style={{ padding: "70px 0", maxWidth: 400, margin: "0 auto" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: r.highlighted ? "8px 12px" : "8px 0", background: r.highlighted ? "var(--secondary, #F5E6D3)" : "transparent", borderRadius: r.highlighted ? 8 : 0, fontWeight: r.highlighted ? 700 : 400 }}>
          <span>{r.label}</span>
          <b>{r.value}</b>
        </div>
      ))}
    </div>
  );
}