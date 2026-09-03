"use client";
import { StatsCountersVariantProps } from "./types";
export default function StatsCountersV2({ stats }: StatsCountersVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", padding: "60px 0" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", gap: 24 }}>
        {stats.map((s, i) => (
          <div key={i}>
            <b style={{ fontSize: "2rem", color: "var(--accent, #D4AF37)", fontFamily: "var(--font, serif)", display: "block" }}>{s.value}</b>
            <span style={{ color: "#999", fontSize: ".85rem" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}