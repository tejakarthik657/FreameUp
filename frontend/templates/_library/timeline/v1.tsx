"use client";
import { TimelineVariantProps } from "./types";
export default function TimelineV1({ heading = "Our Journey", events }: TimelineVariantProps) {
  return (
    <div className="container" style={{ padding: "70px 0", maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 24, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {events.map((e, i) => (
        <div key={i} style={{ borderLeft: "2px solid var(--primary, #8B4513)", padding: "0 0 28px 20px", position: "relative" }}>
          <span style={{ position: "absolute", left: -7, top: 2, width: 12, height: 12, borderRadius: "50%", background: "var(--primary, #8B4513)" }} />
          <b style={{ fontFamily: "var(--font, serif)" }}>{e.year}</b> — {e.label}
        </div>
      ))}
    </div>
  );
}