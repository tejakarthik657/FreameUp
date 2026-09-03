// Auto-generated manifest index for the Component Library.
//
// Source of truth: frontend/templates/_library/originals/<category>/manifest.json
// (22 categories, 86 variants total)
//
// TSX variants (used by the /workshop and rendered into the live preview tree)
// live alongside this file in frontend/templates/_library/{navbar,hero}/.
//
// For categories without TSX variants yet, the workshop renders the original
// HTML via an iframe at /library-originals/<category>/<variant>.html.

export type VariantTags = readonly string[];

export interface VariantMeta {
  id: string;
  name: string;
  tags: VariantTags;
}

export interface ComponentMeta {
  id: string;
  label: string;
  variants: VariantMeta[];
  /** True when at least one variant has a TSX renderer in this codebase. */
  hasTsx: boolean;
}

export const COMPONENT_LIBRARY: readonly ComponentMeta[] = [
  {
    id: "navbar",
    label: "Navbar",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Minimal Light", tags: ["minimal", "light"] },
      { id: "v2", name: "Dark with CTA", tags: ["dark", "bold"] },
      { id: "v3", name: "Centered Logo Split Menu", tags: ["centered", "elegant"] },
      { id: "v4", name: "Transparent Overlay", tags: ["transparent", "for-hero-overlap"] },
      { id: "v5", name: "Bordered Boxed", tags: ["bordered", "structured"] },
      { id: "v6", name: "Pill Nav Links", tags: ["rounded", "modern"] },
      { id: "v7", name: "Sidebar Vertical", tags: ["vertical", "sidebar"] },
      { id: "v8", name: "Logo + Tagline", tags: ["descriptive", "professional"] },
      { id: "v9", name: "Gradient Background", tags: ["gradient", "vibrant"] },
      { id: "v10", name: "Sticky with Shadow", tags: ["sticky", "elevated"] },
    ],
  },
  {
    id: "hero",
    label: "Hero",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Full-Bleed Image with Overlay", tags: ["image", "bold"] },
      { id: "v2", name: "Split Text + Image", tags: ["split", "modern"] },
      { id: "v3", name: "Centered Minimal", tags: ["minimal", "text-only"] },
      { id: "v4", name: "Gradient Background", tags: ["gradient", "vibrant"] },
      { id: "v5", name: "Video-Style Dark", tags: ["dark", "cinematic"] },
      { id: "v6", name: "Card Floating on Image", tags: ["card", "elevated"] },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Minimal Centered", tags: ["minimal"] },
      { id: "v2", name: "Dark Multi-Column", tags: ["dark", "rich"] },
      { id: "v3", name: "Split Brand + Links", tags: ["split"] },
      { id: "v4", name: "Newsletter + Links", tags: ["newsletter"] },
      { id: "v5", name: "Bordered Simple", tags: ["bordered"] },
      { id: "v6", name: "Social-First", tags: ["social"] },
    ],
  },
  {
    id: "about",
    label: "About",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Text Only Centered", tags: ["minimal"] },
      { id: "v2", name: "Image + Text Split", tags: ["split"] },
      { id: "v3", name: "Stats Alongside Text", tags: ["stats"] },
      { id: "v4", name: "Dark Panel", tags: ["dark"] },
    ],
  },
  {
    id: "features",
    label: "Features",
    hasTsx: true,
    variants: [
      { id: "v1", name: "3-Column Icon Cards", tags: ["cards"] },
      { id: "v2", name: "Numbered List", tags: ["list"] },
      { id: "v3", name: "Alternating Rows", tags: ["rows"] },
      { id: "v4", name: "Bordered Grid Dark", tags: ["dark"] },
    ],
  },
  {
    id: "gallery",
    label: "Gallery",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Standard Grid", tags: ["grid"] },
      { id: "v2", name: "Scrollable Filmstrip", tags: ["filmstrip"] },
      { id: "v3", name: "Masonry Mixed Sizes", tags: ["masonry"] },
      { id: "v4", name: "Bordered Frames", tags: ["bordered"] },
    ],
  },
  {
    id: "testimonials",
    label: "Testimonials",
    hasTsx: true,
    variants: [
      { id: "v1", name: "3-Card Grid", tags: ["grid"] },
      { id: "v2", name: "Single Large Quote", tags: ["single"] },
      { id: "v3", name: "Dark Carousel-Style", tags: ["dark"] },
      { id: "v4", name: "Avatar List", tags: ["list"] },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    hasTsx: true,
    variants: [
      { id: "v1", name: "3-Tier Cards", tags: ["cards"] },
      { id: "v2", name: "Simple List with Prices", tags: ["list"] },
      { id: "v3", name: "Highlighted Middle Plan", tags: ["highlighted"] },
      { id: "v4", name: "Dark Table Style", tags: ["dark"] },
    ],
  },
  {
    id: "cta-banner",
    label: "CTA Banner",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Solid Color Centered", tags: ["solid"] },
      { id: "v2", name: "Gradient with Two Buttons", tags: ["gradient"] },
      { id: "v3", name: "Split Text + Button", tags: ["split"] },
      { id: "v4", name: "Dark Bordered", tags: ["dark"] },
    ],
  },
  {
    id: "contact-form",
    label: "Contact Form",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Simple Stacked Form", tags: ["simple"] },
      { id: "v2", name: "Split Info + Form", tags: ["split"] },
      { id: "v3", name: "Dark Card Form", tags: ["dark"] },
      { id: "v4", name: "Inline Compact Form", tags: ["inline"] },
    ],
  },
  {
    id: "menu-services",
    label: "Menu / Services",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Grid Cards", tags: ["grid"] },
      { id: "v2", name: "Collapsible Dense List", tags: ["collapsible"] },
      { id: "v3", name: "Two-Column List with Prices", tags: ["list"] },
    ],
  },
  {
    id: "stats-counters",
    label: "Stats Counters",
    hasTsx: true,
    variants: [
      { id: "v1", name: "4-Column Numbers", tags: ["columns"] },
      { id: "v2", name: "Dark Band", tags: ["dark"] },
      { id: "v3", name: "Inline with Icons Placeholder", tags: ["inline"] },
    ],
  },
  {
    id: "team",
    label: "Team",
    hasTsx: true,
    variants: [
      { id: "v1", name: "3-Card Photo Grid", tags: ["grid"] },
      { id: "v2", name: "Circular Portraits", tags: ["circular"] },
      { id: "v3", name: "Dark List Style", tags: ["dark"] },
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Accordion List", tags: ["accordion"] },
      { id: "v2", name: "2-Column Q&A", tags: ["columns"] },
      { id: "v3", name: "Bordered Cards", tags: ["cards"] },
    ],
  },
  {
    id: "newsletter",
    label: "Newsletter",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Inline Bar", tags: ["inline"] },
      { id: "v2", name: "Boxed Card", tags: ["boxed"] },
      { id: "v3", name: "Dark Full-Width", tags: ["dark"] },
    ],
  },
  {
    id: "map-location",
    label: "Map / Location",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Map + Address Side by Side", tags: ["split"] },
      { id: "v2", name: "Full-Width Map with Overlay Card", tags: ["overlay"] },
      { id: "v3", name: "Simple Address Block", tags: ["simple"] },
    ],
  },
  {
    id: "opening-hours",
    label: "Opening Hours",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Simple List", tags: ["simple"] },
      { id: "v2", name: "Table with Today Highlighted", tags: ["table"] },
      { id: "v3", name: "Dark Card", tags: ["dark"] },
    ],
  },
  {
    id: "social-links",
    label: "Social Links",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Icon Row", tags: ["row"] },
      { id: "v2", name: "Labeled Buttons", tags: ["labeled"] },
      { id: "v3", name: "Dark Follow Section", tags: ["dark"] },
    ],
  },
  {
    id: "blog-teaser",
    label: "Blog Teaser",
    hasTsx: true,
    variants: [
      { id: "v1", name: "3-Card Grid", tags: ["grid"] },
      { id: "v2", name: "Single Featured Post", tags: ["single"] },
      { id: "v3", name: "List with Dates", tags: ["list"] },
    ],
  },
  {
    id: "video-section",
    label: "Video Section",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Full-Width Video Placeholder", tags: ["full"] },
      { id: "v2", name: "Text + Video Split", tags: ["split"] },
      { id: "v3", name: "Play Button Overlay on Image", tags: ["overlay"] },
    ],
  },
  {
    id: "announcement-bar",
    label: "Announcement Bar",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Solid Top Bar", tags: ["solid"] },
      { id: "v2", name: "Gradient with Close Icon", tags: ["gradient"] },
      { id: "v3", name: "Minimal Text Only", tags: ["minimal"] },
    ],
  },
  {
    id: "timeline",
    label: "Timeline",
    hasTsx: true,
    variants: [
      { id: "v1", name: "Vertical Line with Dots", tags: ["vertical"] },
      { id: "v2", name: "Horizontal Steps", tags: ["horizontal"] },
      { id: "v3", name: "Dark Numbered", tags: ["dark"] },
    ],
  },
];

export function getComponentMeta(id: string): ComponentMeta | undefined {
  return COMPONENT_LIBRARY.find((c) => c.id === id);
}

export function listAllVariants(): Array<{
  component: ComponentMeta;
  variant: VariantMeta;
}> {
  return COMPONENT_LIBRARY.flatMap((c) => c.variants.map((v) => ({ component: c, variant: v })));
}