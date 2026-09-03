import { Business } from "@/lib/types";

interface BusinessHoursProps {
  business: Business;
  className?: string;
}

export function BusinessHours({ business, className = "" }: BusinessHoursProps) {
  if (!business.hours || business.hours.length === 0) return null;

  return (
    <div className={`space-y-1 ${className}`}>
      {business.hours.map((hour) => (
        <div
          key={hour.day}
          className="flex justify-between py-2 border-b border-white/10 last:border-0 text-sm"
        >
          <span className="font-medium">{hour.day}</span>
          <span className="opacity-80">
            {hour.closed ? "Closed" : [hour.open, hour.close].filter(Boolean).join(" - ") || "Hours by appointment"}
          </span>
        </div>
      ))}
    </div>
  );
}
