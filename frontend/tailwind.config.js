/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./templates/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── APPLE DESIGN SYSTEM COLOR PALETTE (design.md) ──
        primary: {
          DEFAULT: "#0066cc", // Action Blue
          focus: "#0071e3",
          hover: "#0071e3",
          dark: "#2997ff", // Sky Link Blue on dark surfaces
        },
        ink: {
          DEFAULT: "#1d1d1f", // Near-black ink for headlines & text
          muted80: "#333333",
          muted48: "#7a7a7a",
        },
        body: {
          DEFAULT: "#1d1d1f",
          onDark: "#ffffff",
          muted: "#86868b",
        },
        canvas: {
          DEFAULT: "#ffffff", // Pure white
          parchment: "#f5f5f7", // Signature Apple off-white
        },
        surface: {
          pearl: "#fafafc",
          tile1: "#272729", // Near-black Tile 1
          tile2: "#2a2a2c",
          tile3: "#252527",
          black: "#000000", // Pure black global nav
          chip: "rgba(210, 210, 215, 0.64)",
        },
        hairline: "#e0e0e0",
        dividerSoft: "#f0f0f0",

        // Backward compatibility aliases
        clay: {
          ink: "#1d1d1f",
          soft: "#f5f5f7",
          card: "#ffffff",
          strong: "#e0e0e0",
        },
        brand: {
          DEFAULT: "#0066cc",
          pink: "#ff4d8b",
          teal: "#1a3a3a",
          lavender: "#b8a4ed",
          peach: "#ffb084",
          ochre: "#e8b94a",
          mint: "#a4d4c5",
          coral: "#ff6b5a",
        },
      },
      borderRadius: {
        none: "0px",
        xs: "5px",
        sm: "8px",
        md: "11px",
        lg: "18px", // Apple Store utility card standard
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        pill: "9999px", // Signature Apple pill
        full: "9999px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightDisplay: "-0.28px",
        tightBody: "-0.374px",
        appleLink: "-0.12px",
      },
      boxShadow: {
        product: "rgba(0, 0, 0, 0.22) 3px 5px 30px 0px", // Signature Apple product shadow
        hairline: "0 0 0 1px rgba(0, 0, 0, 0.08)",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
