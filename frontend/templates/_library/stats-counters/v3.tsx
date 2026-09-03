"use client";
import { StatsCountersVariantProps } from "./types";
export default function StatsCountersV3({ stats }: StatsCountersVariantProps) {
  return (
    <div className="container" style={{ padding: "50px 0", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
      {stats.map((s, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <b style={{ fontSize: "1.5rem", color: "var(--primary, #8B4513)", display: "block", fontFamily: "var(--font, serif)" }}>{s.value}</b>
          <span style={{ fontSize: ".8rem", color: "var(--muted, #6b7280)" }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}