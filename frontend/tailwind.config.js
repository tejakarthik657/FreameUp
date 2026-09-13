/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./templates/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#ffffff",
        navy: {
          dark: "#011f4b",     // Midnight Deep Blue
          royal: "#03396c",    // Royal Navy Blue
          cobalt: "#005b96",   // Primary Accent Blue
          slate: "#6497b1",    // Soft Slate Blue
          ice: "#b3cde0",      // Light Ice Tint
          icelight: "#f0f6fa", // Very Soft Ice Blue
        },
        mustard: {
          DEFAULT: "#e5a900",  // Key Accent Mustard Yellow
          hover: "#d99b00",    // Rich Mustard Hover
          dark: "#b87c00",     // Deep Mustard Text/Border
          light: "#fef9c3",    // Light Mustard Highlight Tint
        },
        ink: {
          DEFAULT: "#0a0a0a",  // Crisp Pure Black
          soft: "#1f2937",     // Charcoal Soft Black
          muted: "#4b5563",    // Slate Muted Gray
        },
        brand: {
          DEFAULT: "#005b96",
          navy: "#011f4b",
          royal: "#03396c",
          cobalt: "#005b96",
          slate: "#6497b1",
          ice: "#b3cde0",
          mustard: "#e5a900",
        },
        bg: {
          primary: "var(--background)",
          secondary: "var(--surface)",
          elevated: "var(--surface-high)",
          subtle: "var(--surface-high)",
        },
        border: {
          DEFAULT: "#e2e8f0",
          card: "#cbd5e1",
          focus: "#005b96",
          strong: "#03396c",
          mustard: "#e5a900",
        },
      },
      borderRadius: {
        '3xl': '24px',
        '2xl': '16px',
        'xl': '12px',
        'lg': '8px',
      },
      fontFamily: {
        heading: ["var(--font-instrument-serif)", "serif"],
        serif: ["var(--font-instrument-serif)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 3px 0 rgba(1, 31, 75, 0.05)",
        md: "0 4px 12px -2px rgba(1, 31, 75, 0.08)",
        lg: "0 12px 24px -4px rgba(1, 31, 75, 0.12)",
        mustard: "0 4px 14px 0 rgba(229, 169, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
