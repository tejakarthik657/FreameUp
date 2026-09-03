"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV8({ brand, tagline, links }: NavbarVariantProps) {
  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
      <div>
        <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.4rem", color: "var(--primary, #8B4513)", lineHeight: 1 }}>{brand}</div>
        {tagline && <div style={{ fontSize: ".72rem", color: "var(--muted, #6b7280)", marginTop: 4, letterSpacing: ".04em" }}>{tagline}</div>}
      </div>
      <ul style={{ display: "flex", gap: 32, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem", fontWeight: 500 }}>
        {links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
      </ul>
    </div>
  );
}