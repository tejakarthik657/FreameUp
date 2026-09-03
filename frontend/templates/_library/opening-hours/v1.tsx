"use client";
import { OpeningHoursVariantProps } from "./types";
export default function OpeningHoursV1({ heading, rows }: OpeningHoursVariantProps) {
  return (
    <div className="container" style={{ padding: "70px 0", maxWidth: 400, margin: "0 auto" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
          <span>{r.label}</span>
          <b>{r.value}</b>
        </div>
      ))}
    </div>
  );
}