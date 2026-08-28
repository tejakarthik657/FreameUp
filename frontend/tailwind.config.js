/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./templates/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--background)",
          secondary: "var(--surface)",
          elevated: "var(--surface-high)",
          subtle: "var(--surface-high)",
        },
        border: {
          DEFAULT: "var(--border)",
          card: "var(--border)",
          focus: "var(--accent)",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          onDark: "var(--text-on-dark)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          glow: "var(--accent-glow)",
          secondary: "var(--accent-success)",
          tertiary: "var(--accent-blue)",
          warm: "var(--accent-warm)",
          rose: "var(--accent-rose)",
        },
        dark: {
          bg: "var(--dark-bg)",
          surface: "var(--dark-surface)",
          surface2: "var(--dark-surface-2)",
          border: "var(--dark-border)",
          text: "var(--dark-text)",
          muted: "var(--dark-text-muted)",
        },
        sector: {
          restaurant: "var(--sector-restaurant)",
          salon: "var(--sector-salon)",
          local: "var(--sector-local)",
          others: "var(--sector-others)",
        },
        critical: {
          DEFAULT: "#EF4444",
          bg: "#FEF2F2",
          border: "#FCA5A5",
        },
        warning: {
          DEFAULT: "var(--accent-warm)",
          bg: "#FFFBEB",
          border: "#FDE68A",
        },
        safe: {
          DEFAULT: "var(--accent-success)",
          bg: "#ECFDF5",
          border: "#A7F3D0",
        },
        brand: {
          DEFAULT: "var(--accent)",
          dark: "#4F46E5",
        },
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        fraunces: ["var(--font-fraunces)", "serif"],
        playfair: ["var(--font-playfair)", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        accent: "var(--shadow-accent)",
        glow: "var(--shadow-glow)",
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
