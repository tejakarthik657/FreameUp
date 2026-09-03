"use client";
import { SocialLinksVariantProps } from "./types";
export default function SocialLinksV2({ heading = "Follow Us", links }: SocialLinksVariantProps) {
  return (
    <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
        {links.map((s, i) => (
          <a key={i} href={s.href || "#"} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--primary, #8B4513)", color: "#fff" }}>{s.label}</a>
        ))}
      </div>
    </div>
  );
}