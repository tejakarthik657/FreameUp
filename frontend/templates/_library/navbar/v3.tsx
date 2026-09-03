"use client";

import { NavbarVariantProps } from "./types";

export default function NavbarV3({ brand, links }: NavbarVariantProps) {
  const half = Math.ceil(links.length / 2);
  const left = links.slice(0, half);
  const right = links.slice(half);
  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "20px 0", gap: 24 }}>
      <ul style={{ display: "flex", gap: 28, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem", fontWeight: 500, justifyContent: "flex-end" }}>
        {left.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
      </ul>
      <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, fontSize: "1.4rem", textAlign: "center", color: "var(--primary, #8B4513)" }}>{brand}</div>
      <ul style={{ display: "flex", gap: 28, listStyle: "none", padding: 0, margin: 0, fontSize: ".95rem", fontWeight: 500, justifyContent: "flex-start" }}>
        {right.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
      </ul>
    </div>
  );
}