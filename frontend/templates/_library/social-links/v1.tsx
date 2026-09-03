"use client";
import { SocialLinksVariantProps } from "./types";
export default function SocialLinksV1({ links }: SocialLinksVariantProps) {
  return (
    <div className="container" style={{ padding: "50px 0", display: "flex", justifyContent: "center", gap: 16 }}>
      {links.map((s, i) => (
        <a key={i} href={s.href || "#"} style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--secondary, #F5E6D3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary, #8B4513)", fontWeight: 700, fontSize: ".75rem" }}>{s.label}</a>
      ))}
    </div>
  );
}