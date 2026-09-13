/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./templates/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#fffaf0",
        clay: {
          ink: "#0a0a0a",
          soft: "#faf5e8",
          card: "#f5f0e0",
          strong: "#ebe6d6",
        },
        brand: {
          DEFAULT: "var(--accent)",
          pink: "#ff4d8b",
          teal: "#1a3a3a",
          lavender: "#b8a4ed",
          peach: "#ffb084",
          ochre: "#e8b94a",
          mint: "#a4d4c5",
          coral: "#ff6b5a",
        },
        bg: {
          primary: "var(--background)",
          secondary: "var(--surface)",
          elevated: "var(--surface-high)",
          subtle: "var(--surface-high)",
        },
        border: {
          DEFAULT: "var(--border)",
          card: "var(--border)",
          focus: "#0a0a0a",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          onDark: "var(--text-on-dark)",
        },
        accent: {
          DEFAULT: "#ff4d8b",
          hover: "#e03c77",
          glow: "rgba(255, 77, 139, 0.2)",
          secondary: "#22c55e",
          tertiary: "#3b82f6",
          warm: "#f59e0b",
          rose: "#ff4d8b",
        },
        sector: {
          restaurant: "#e8b94a",
          salon: "#ff4d8b",
          local: "#ffb084",
          others: "#b8a4ed",
        },
      },
      borderRadius: {
        '3xl': '24px',
        '2xl': '16px',
        'xl': '12px',
        'lg': '8px',
      },
      // ── STRICT 3-FONT FAMILY SYSTEM ──
      // 1. Display Headings: Instrument Serif
      // 2. Primary Body & UI: Inter
      // 3. Badges & Code & Metrics: JetBrains Mono
      fontFamily: {
        heading: ["var(--font-instrument-serif)", "serif"],
        serif: ["var(--font-instrument-serif)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        // Standardized Aliases
        fraunces: ["var(--font-instrument-serif)", "serif"],
        playfair: ["var(--font-instrument-serif)", "serif"],
        poppins: ["var(--font-inter)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        clay: "0 8px 24px -4px rgba(10, 10, 10, 0.06)",
      },
      keyframes: {
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        spin: "spin 0.8s linear infinite",
      },
    },
  },
  plugins: [],
};
