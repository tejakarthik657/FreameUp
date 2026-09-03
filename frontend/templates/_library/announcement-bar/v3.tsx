"use client";
import { AnnouncementBarVariantProps } from "./types";
export default function AnnouncementBarV3({ message }: AnnouncementBarVariantProps) {
  return <div style={{ textAlign: "center", padding: 10, fontSize: ".8rem", color: "var(--muted, #6b7280)", borderBottom: "1px solid var(--border, #e5e7eb)" }}>{message}</div>;
}