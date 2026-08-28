import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  target,
  rel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-mono uppercase tracking-wider transition-all duration-200";

  const variants = {
    primary: "bg-accent text-white hover:brightness-110 shadow-sm",
    secondary: "bg-text-primary text-white hover:brightness-110",
    outline:
      "border border-border bg-transparent text-text-primary hover:border-text-primary",
    ghost: "text-text-secondary hover:text-text-primary",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
