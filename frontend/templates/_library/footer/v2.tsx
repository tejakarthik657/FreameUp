"use client";
import { FooterVariantProps } from "./types";
export default function FooterV2({ brand, tagline, groups = [], copyright }: FooterVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#ccc", padding: "60px 0 30px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, marginBottom: 36 }}>
          <div>
            <h4 style={{ color: "#fff", fontSize: ".95rem", marginBottom: 14, fontFamily: "var(--font, serif)" }}>{brand}</h4>
            <p style={{ fontSize: ".85rem" }}>{tagline}</p>
          </div>
          {groups.map((g, i) => (
            <div key={i}>
              <h4 style={{ color: "#fff", fontSize: ".95rem", marginBottom: 14, fontFamily: "var(--font, serif)" }}>{g.heading}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: ".85rem" }}>
                {g.items.map((it, j) => <li key={j}>{it.href ? <a href={it.href}>{it.label}</a> : it.label}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #333", paddingTop: 20, fontSize: ".8rem", textAlign: "center" }}>{copyright}</div>
      </div>
    </div>
  );
}