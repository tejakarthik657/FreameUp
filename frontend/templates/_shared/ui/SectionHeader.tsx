import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-12 ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-5xl text-text-primary mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
