"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV7({ brand, links, cta }: NavbarVariantProps) {
  return (
    <aside style={{ width: 220, minHeight: "100vh", background: "#111", color: "#fff", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.4rem" }}>{brand}</div>
      <ul style={{ display: "flex", flexDirection: "column", gap: 16, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem" }}>
        {links.map((l) => <li key={l.label}><a href={l.href} style={{ color: "#bbb" }}>{l.label}</a></li>)}
      </ul>
      {cta && (
        <a href={cta.href} style={{ background: "var(--accent, #D4AF37)", color: "#111", padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: ".85rem", textAlign: "center" }}>
          {cta.label}
        </a>
      )}
    </aside>
  );
}