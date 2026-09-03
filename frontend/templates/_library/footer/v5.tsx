"use client";
import { FooterVariantProps } from "./types";
export default function FooterV5({ brand, builtWith }: FooterVariantProps) {
  return (
    <div className="container" style={{ borderTop: "2px solid var(--dark, #111)", padding: "36px 0", display: "flex", justifyContent: "space-between", fontSize: ".85rem", color: "var(--muted, #6b7280)" }}>
      <span>© 2026 {brand}</span>
      <span>{builtWith}</span>
    </div>
  );
}