"use client";
import { VideoSectionVariantProps } from "./types";
export default function VideoSectionV3({ imageUrl }: VideoSectionVariantProps) {
  return (
    <div style={{ position: "relative", maxWidth: 900, margin: "70px auto", borderRadius: 14, overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {imageUrl ? <img src={imageUrl} alt={heading} style={{ aspectRatio: "16/9", objectFit: "cover", width: "100%", display: "block" }} /> : <div aria-hidden="true" style={{ aspectRatio: "16 / 9", background: "var(--secondary, #f5e6d3)" }} />}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.3)" }}>
        <span style={{ width: 70, height: 70, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary, #8B4513)", fontSize: "1.4rem" }}>▶</span>
      </div>
    </div>
  );
}