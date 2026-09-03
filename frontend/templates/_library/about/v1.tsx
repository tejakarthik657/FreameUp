"use client";
import { AboutVariantProps } from "./types";
export default function AboutV1({ title, description }: AboutVariantProps) {
  return (
    <div className="container">
      <div style={{ textAlign: "center", padding: "80px 0", maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 20, fontFamily: "var(--font, serif)" }}>{title}</h2>
        <p style={{ color: "var(--muted, #6b7280)", fontSize: "1.05rem" }}>{description}</p>
      </div>
    </div>
  );
}