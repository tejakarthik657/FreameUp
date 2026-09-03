"use client";
import { AnnouncementBarVariantProps } from "./types";
export default function AnnouncementBarV2({ message, linkLabel, linkHref }: AnnouncementBarVariantProps) {
  return (
    <div style={{ background: "linear-gradient(90deg, var(--primary, #8B4513), var(--accent, #D4AF37))", color: "#fff", textAlign: "center", padding: 12, fontSize: ".85rem", display: "flex", justifyContent: "center", gap: 16, alignItems: "center" }}>
      <span>{message}</span>
      {linkLabel && <a href={linkHref || "#"} style={{ textDecoration: "underline" }}>{linkLabel}</a>}
    </div>
  );
}