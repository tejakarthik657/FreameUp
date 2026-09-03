"use client";
import { VideoSectionVariantProps } from "./types";
export default function VideoSectionV1({ heading = "See Us in Action", embedLabel = "▶ Video Embed" }: VideoSectionVariantProps) {
  return (
    <div className="container" style={{ padding: "70px 0", textAlign: "center" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ background: "var(--dark, #111)", color: "#fff", aspectRatio: "16/9", maxWidth: 900, margin: "20px auto 0", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{embedLabel}</div>
    </div>
  );
}