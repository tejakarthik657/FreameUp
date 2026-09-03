"use client";
import { AboutVariantProps } from "./types";
export default function AboutV2({ title, description, imageUrl }: AboutVariantProps) {
  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", padding: "80px 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {imageUrl ? <img src={imageUrl} alt={title} style={{ borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,.12)", width: "100%", display: "block" }} /> : <div aria-hidden="true" style={{ aspectRatio: "7 / 5", borderRadius: 16, background: "var(--secondary, #f5e6d3)" }} />}
      <div>
        <h2 style={{ fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{title}</h2>
        <p style={{ color: "var(--muted, #6b7280)" }}>{description}</p>
      </div>
    </div>
  );
}