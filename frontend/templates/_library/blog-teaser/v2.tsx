"use client";
import { BlogTeaserVariantProps } from "./types";
export default function BlogTeaserV2({ heading, posts }: BlogTeaserVariantProps) {
  const p = posts[0] || { title: heading };
  return (
    <div className="container" style={{ padding: "80px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.imageUrl ? <img src={p.imageUrl} alt={p.title} style={{ borderRadius: 14, width: "100%", display: "block" }} /> : <div aria-hidden="true" style={{ aspectRatio: "3 / 2", borderRadius: 14, background: "var(--secondary, #f5e6d3)" }} />}
      <div>
        {p.eyebrow && <span style={{ textTransform: "uppercase", letterSpacing: ".08em", fontSize: ".75rem", fontWeight: 700, color: "var(--primary, #8B4513)" }}>{p.eyebrow}</span>}
        <h2 style={{ color: "var(--primary, #8B4513)", margin: "10px 0", fontFamily: "var(--font, serif)" }}>{p.title}</h2>
        <p style={{ color: "var(--muted, #6b7280)" }}>{p.date}</p>
      </div>
    </div>
  );
}