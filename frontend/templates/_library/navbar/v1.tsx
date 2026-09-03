"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV1({ brand, links }: NavbarVariantProps) {
  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
      <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.3rem", color: "var(--primary, #8B4513)" }}>{brand}</div>
      <ul style={{ display: "flex", gap: 32, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem", fontWeight: 500 }}>
        {links.map((l) => (
          <li key={l.label}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>
    </div>
  );
}