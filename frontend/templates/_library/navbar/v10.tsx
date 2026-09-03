"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV10({ brand, links, cta }: NavbarVariantProps) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)", boxShadow: "0 4px 14px rgba(0,0,0,.08)" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
        <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.3rem", color: "var(--primary, #8B4513)" }}>{brand}</div>
        <ul style={{ display: "flex", gap: 28, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem", fontWeight: 500 }}>
          {links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
        </ul>
        {cta && (
          <a href={cta.href} style={{ background: "var(--primary, #8B4513)", color: "#fff", padding: "9px 20px", borderRadius: 999, fontWeight: 700, fontSize: ".85rem" }}>
            {cta.label}
          </a>
        )}
      </div>
    </div>
  );
}