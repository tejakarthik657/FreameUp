"use client";
import { TimelineVariantProps } from "./types";
export default function TimelineV3({ heading = "Our Journey", events }: TimelineVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", padding: "70px 0" }}>
      <div className="container">
        <h2 style={{ color: "var(--accent, #D4AF37)", marginBottom: 20, fontFamily: "var(--font, serif)" }}>{heading}</h2>
        {events.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: "1px solid #333" }}>
            <span style={{ color: "var(--accent, #D4AF37)", fontFamily: "var(--font, serif)", fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
            <span>{e.year} — {e.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}