"use client";
import { BlogTeaserVariantProps } from "./types";
export default function BlogTeaserV1({ heading, posts }: BlogTeaserVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 24, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {posts.map((p, i) => (
          <div key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.imageUrl ? <img src={p.imageUrl} alt={p.title} style={{ borderRadius: 10, aspectRatio: "16/9", objectFit: "cover", marginBottom: 12, width: "100%", display: "block" }} /> : <div aria-hidden="true" style={{ aspectRatio: "16 / 9", borderRadius: 10, marginBottom: 12, background: "var(--secondary, #f5e6d3)" }} />}
            <h3 style={{ fontSize: "1rem", fontFamily: "var(--font, serif)" }}>{p.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}