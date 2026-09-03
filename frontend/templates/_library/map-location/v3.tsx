"use client";
import { MapLocationVariantProps } from "./types";
export default function MapLocationV3({ heading = "Location", address }: MapLocationVariantProps) {
  return (
    <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <p style={{ color: "var(--muted, #6b7280)" }}>{address}</p>
    </div>
  );
}