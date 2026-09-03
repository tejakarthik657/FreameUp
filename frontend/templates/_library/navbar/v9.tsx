"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV9({ brand, links, cta, theme }: NavbarVariantProps) {
  const primary = theme?.primary ?? "#8B4513";
  const accent = theme?.accent ?? "#D4AF37";
  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", background: `linear-gradient(135deg, ${primary}, ${accent})`, color: "#fff", borderRadius: 4, paddingLeft: 16, paddingRight: 16 }}>
      <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.3rem" }}>{brand}</div>
      <ul style={{ display: "flex", gap: 28, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem" }}>
        {links.map((l) => <li key={l.label}><a href={l.href} style={{ color: "#fff" }}>{l.label}</a></li>)}
      </ul>
      {cta && (
        <a href={cta.href} style={{ background: "#fff", color: primary, padding: "8px 18px", borderRadius: 999, fontWeight: 700, fontSize: ".85rem" }}>
          {cta.label}
        </a>
      )}
    </div>
  );
}