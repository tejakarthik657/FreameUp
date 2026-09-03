// Shared props for navbar variants — kept narrow so the workshop can wire
// any navbar variant into a business without touching the renderer.

export interface NavbarVariantProps {
  brand: string;
  tagline?: string;
  links: Array<{ label: string; href: string }>;
  cta?: { label: string; href: string };
  /** Theme tokens — same names as the static library's CSS vars. */
  theme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    dark?: string;
  };
}

export const DEFAULT_LINKS = [
  { label: "Home", href: "#" },
  { label: "Menu", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export const DEFAULT_THEME = {
  primary: "#8B4513",
  secondary: "#F5E6D3",
  accent: "#D4AF37",
  dark: "#111111",
};