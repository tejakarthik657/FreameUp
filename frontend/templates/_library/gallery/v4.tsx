"use client";
import { GalleryVariantProps } from "./types";
export default function GalleryV4({ heading, images }: GalleryVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 32, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {images.map((img, i) => (
          <div key={i} style={{ border: "6px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,.15)", borderRadius: 6, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt || ""} style={{ aspectRatio: "4/3", objectFit: "cover", width: "100%", display: "block" }} />
          </div>
        ))}
      </div>
    </div>
  );
}