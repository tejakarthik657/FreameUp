"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV5({ brand, links }: NavbarVariantProps) {
  return (
    <div className="container" style={{ padding: "12px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", border: "1px solid var(--border, #e5e7eb)", borderRadius: 12, background: "#fff" }}>
        <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.2rem", color: "var(--primary, #8B4513)" }}>{brand}</div>
        <ul style={{ display: "flex", gap: 28, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem", fontWeight: 500 }}>
          {links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
        </ul>
      </div>
    </div>
  );
}