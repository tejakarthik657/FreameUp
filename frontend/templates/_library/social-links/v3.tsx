"use client";
import { SocialLinksVariantProps } from "./types";
export default function SocialLinksV3({ heading = "Follow Us", links }: SocialLinksVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", padding: "50px 0", textAlign: "center" }}>
      <div className="container">
        <h2 style={{ color: "#fff", fontFamily: "var(--font, serif)" }}>{heading}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 14 }}>
          {links.map((s, i) => <a key={i} href={s.href || "#"} style={{ color: "var(--accent, #D4AF37)" }}>{s.label}</a>)}
        </div>
      </div>
    </div>
  );
}