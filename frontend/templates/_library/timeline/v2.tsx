"use client";
import { TimelineVariantProps } from "./types";
export default function TimelineV2({ heading = "Our Journey", events }: TimelineVariantProps) {
  return (
    <div className="container" style={{ padding: "70px 0" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", textAlign: "center", marginBottom: 28, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center", gap: 16 }}>
        {events.map((e, i) => (
          <div key={i}>
            <b style={{ display: "block", color: "var(--primary, #8B4513)", fontFamily: "var(--font, serif)", fontSize: "1.3rem" }}>{e.year}</b>
            <span style={{ fontSize: ".9rem", color: "var(--muted, #6b7280)" }}>{e.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}