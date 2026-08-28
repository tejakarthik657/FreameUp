import { Business } from "@/lib/types";
import { SectionProps } from "../../types";

interface TestimonialsRowProps extends SectionProps {}

export function TestimonialsRow({ business }: TestimonialsRowProps) {
  if (!business.testimonials || business.testimonials.length === 0) return null;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {business.testimonials.map((t, idx) => (
        <div
          key={idx}
          className="p-6 bg-bg-secondary border border-border rounded-lg"
        >
          <p className="text-text-secondary text-sm leading-relaxed mb-4">"{t.quote}"</p>
          <div>
            <p className="font-medium text-text-primary text-sm">{t.author}</p>
            {t.role && (
              <p className="text-text-muted text-xs">{t.role}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
