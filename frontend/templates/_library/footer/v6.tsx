"use client";
import { FooterVariantProps } from "./types";
export default function FooterV6({ socials = [], copyright }: FooterVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", textAlign: "center", padding: "44px 0" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 18 }}>
          {socials.map((s, i) => (
            <a key={i} href={s.href || "#"} style={{ width: 40, height: 40, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem", color: "#fff" }}>{s.label}</a>
          ))}
        </div>
        <p style={{ fontSize: ".85rem", color: "#999" }}>{copyright}</p>
      </div>
    </div>
  );
}