import { Business } from "@/lib/types";
import { SectionProps } from "../../types";

interface GalleryGridProps extends SectionProps {}

export function GalleryGrid({ business, density = "standard" }: GalleryGridProps) {
  const images = business.images;
  if (!images || images.length === 0) return null;

  const cols = density === "expanded" ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div className={`grid ${cols} gap-4`}>
      {images.map((url, idx) => (
        <div
          key={idx}
          className="aspect-[4/3] overflow-hidden bg-bg-secondary"
        >
          <img
            src={url}
            alt={`${business.name} gallery ${idx + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
    </div>
  );
}
