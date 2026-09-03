"use client";
import { FooterVariantProps } from "./types";
export default function FooterV3({ brand, groups = [] }: FooterVariantProps) {
  const flatLinks = groups.flatMap((g) => g.items);
  return (
    <div className="container" style={{ padding: "50px 0", borderTop: "1px solid var(--border, #e5e7eb)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.2rem", color: "var(--primary, #8B4513)" }}>{brand}</div>
      <ul style={{ display: "flex", gap: 24, listStyle: "none", padding: 0, margin: 0, fontSize: ".9rem" }}>
        {flatLinks.map((it, i) => <li key={i}>{it.href ? <a href={it.href}>{it.label}</a> : it.label}</li>)}
      </ul>
    </div>
  );
}