"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV6({ brand, links }: NavbarVariantProps) {
  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0" }}>
      <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.3rem", color: "var(--primary, #8B4513)" }}>{brand}</div>
      <ul style={{ display: "flex", gap: 8, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem", fontWeight: 500 }}>
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} style={{ display: "inline-block", padding: "8px 18px", borderRadius: 999, background: "var(--secondary, #F5E6D3)", color: "var(--primary, #8B4513)" }}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}