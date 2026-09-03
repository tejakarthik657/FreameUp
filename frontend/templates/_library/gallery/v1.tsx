"use client";
import { GalleryVariantProps } from "./types";
export default function GalleryV1({ heading, images }: GalleryVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 32, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={img.url} alt={img.alt || ""} style={{ borderRadius: 12, aspectRatio: "4/3", objectFit: "cover", boxShadow: "0 10px 24px rgba(0,0,0,.1)", width: "100%", display: "block" }} />
        ))}
      </div>
    </div>
  );
}