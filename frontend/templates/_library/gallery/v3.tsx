"use client";
import { GalleryVariantProps } from "./types";
export default function GalleryV3({ heading, images }: GalleryVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 32, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ columnCount: 3, columnGap: 16 }}>
        {images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={img.url} alt={img.alt || ""} style={{ width: "100%", borderRadius: 12, marginBottom: 16, display: "block" }} />
        ))}
      </div>
    </div>
  );
}