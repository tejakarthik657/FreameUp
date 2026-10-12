/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./templates/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Linear-inspired dark slate foundation
        canvas: {
          DEFAULT: "#0d0e12",
          soft: "#12141a",
        },
        surface: {
          DEFAULT: "#12141a",
          card: "#16171d",
          elevated: "#1e2029",
          hover: "#252833",
          active: "#2c303d",
        },
        hairline: {
          DEFAULT: "#292b35",
          strong: "#3f4352",
          focus: "#635bff",
        },
        ink: {
          display: "#f8fafc",
          body: "#cbd5e1",
          muted: "#94a3b8",
          subtle: "#64748b",
          disabled: "#475569",
        },
        // Primary brand & agent specialists
        brand: {
          DEFAULT: "#635bff",
          primary: "#635bff",
          hover: "#7a73ff",
          active: "#5046e5",
        },
        agent: {
          intake: "#38bdf8",     // Cyan
          cleaner: "#f59e0b",    // Amber
          auditor: "#ef4444",    // Coral Red
          analyst: "#8b5cf6",    // Violet
          forecaster: "#ec4899", // Pink
          strategist: "#14b8a6", // Teal
          ops: "#6366f1",        // Indigo
        },
        // Data Passport & Privacy Layer
        passport: {
          verified: "#3ecf8e",   // Supabase Emerald
          warning: "#f59e0b",
          danger: "#ef4444",
        },
        // Connectors
        source: {
          file: "#22c55e",
          database: "#3b82f6",
          mcp: "#a855f7",
          webhook: "#eab308",
        },
        diff: {
          added: "rgba(62, 207, 142, 0.15)",
          removed: "rgba(239, 68, 68, 0.15)",
          changed: "rgba(245, 158, 11, 0.15)",
        },
      },
      borderRadius: {
        '3xl': '24px',
        '2xl': '16px',
        'xl': '12px',
        'lg': '8px',
        'md': '6px',
        'sm': '4px',
        'modal': '12px',
        'card': '8px',
        'button': '6px',
      },
      fontFamily: {
        heading: ["var(--font-inter)", "-apple-system", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "serif"],
        sans: ["var(--font-inter)", "-apple-system", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        md: "0 4px 12px -2px rgba(0, 0, 0, 0.5)",
        lg: "0 12px 28px -4px rgba(0, 0, 0, 0.6)",
        modal: "0 20px 40px rgba(0, 0, 0, 0.7)",
      },
      keyframes: {
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 12px rgba(99, 91, 255, 0.5)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 4px rgba(99, 91, 255, 0.2)' },
        },
      },
      animation: {
        spin: "spin 0.8s linear infinite",
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
