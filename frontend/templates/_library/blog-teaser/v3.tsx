"use client";
import { BlogTeaserVariantProps } from "./types";
export default function BlogTeaserV3({ heading, posts }: BlogTeaserVariantProps) {
  return (
    <div className="container" style={{ padding: "70px 0", maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {posts.map((p, i) => (
        <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
          {p.date && <div style={{ fontSize: ".8rem", color: "var(--muted, #6b7280)" }}>{p.date}</div>}
          <h3 style={{ fontSize: "1rem", fontFamily: "var(--font, serif)" }}>{p.title}</h3>
        </div>
      ))}
    </div>
  );
}