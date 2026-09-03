"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV2({ brand, links, cta }: NavbarVariantProps) {
  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", background: "#111", color: "#fff", borderRadius: 4 }}>
      <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.3rem", paddingLeft: 16 }}>{brand}</div>
      <ul style={{ display: "flex", gap: 28, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem" }}>
        {links.map((l) => (
          <li key={l.label}><a href={l.href} style={{ color: "#ddd" }}>{l.label}</a></li>
        ))}
      </ul>
      {cta && (
        <a href={cta.href} style={{ background: "var(--accent, #D4AF37)", color: "#111", padding: "10px 22px", borderRadius: 999, fontWeight: 700, fontSize: ".85rem", marginRight: 16 }}>
          {cta.label}
        </a>
      )}
    </div>
  );
}