"use client";
import { VideoSectionVariantProps } from "./types";
export default function VideoSectionV2({ heading = "See Us in Action", description = "A quick look inside our kitchen.", embedLabel = "▶ Video Embed" }: VideoSectionVariantProps) {
  return (
    <div className="container" style={{ padding: "70px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
      <div>
        <h2 style={{ color: "var(--primary, #8B4513)", fontFamily: "var(--font, serif)" }}>{heading}</h2>
        <p style={{ color: "var(--muted, #6b7280)" }}>{description}</p>
      </div>
      <div style={{ background: "var(--dark, #111)", color: "#fff", aspectRatio: "16/9", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{embedLabel}</div>
    </div>
  );
}