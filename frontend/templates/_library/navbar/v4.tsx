"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV4({ brand, links, cta }: NavbarVariantProps) {
  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", color: "#fff", background: "transparent" }}>
      <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.3rem" }}>{brand}</div>
      <ul style={{ display: "flex", gap: 28, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem", fontWeight: 500 }}>
        {links.map((l) => <li key={l.label}><a href={l.href} style={{ color: "#fff" }}>{l.label}</a></li>)}
      </ul>
      {cta && (
        <a href={cta.href} style={{ border: "1.5px solid #fff", color: "#fff", padding: "8px 18px", borderRadius: 999, fontWeight: 600, fontSize: ".85rem" }}>
          {cta.label}
        </a>
      )}
    </div>
  );
}