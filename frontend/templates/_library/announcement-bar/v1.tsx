"use client";
import { AnnouncementBarVariantProps } from "./types";
export default function AnnouncementBarV1({ message }: AnnouncementBarVariantProps) {
  return <div style={{ background: "var(--primary, #8B4513)", color: "#fff", textAlign: "center", padding: 10, fontSize: ".85rem", fontWeight: 600 }}>{message}</div>;
}