"use client";
import { StatsCountersVariantProps } from "./types";
export default function StatsCountersV1({ stats }: StatsCountersVariantProps) {
  return (
    <div className="container" style={{ padding: "70px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", gap: 24 }}>
        {stats.map((s, i) => (
          <div key={i}>
            <b style={{ fontSize: "2rem", color: "var(--primary, #8B4513)", fontFamily: "var(--font, serif)", display: "block" }}>{s.value}</b>
            <span style={{ color: "var(--muted, #6b7280)", fontSize: ".85rem" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}