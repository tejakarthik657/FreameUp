"use client";
import { FooterVariantProps } from "./types";
export default function FooterV1({ copyright }: FooterVariantProps) {
  return <div className="container" style={{ textAlign: "center", padding: "40px 0", color: "var(--muted, #6b7280)", fontSize: ".9rem" }}><p>{copyright}</p></div>;
}