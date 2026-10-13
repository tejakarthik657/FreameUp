import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Instrument_Serif,
  Fraunces,
  Playfair_Display,
  Poppins,
} from "next/font/google";
import "./globals.css";

// ── APPLE DESIGN SYSTEM TYPOGRAPHY SUITE (DESIGN.md) ──
// 1. Primary UI & Body: Inter (calibrated to match SF Pro across all platforms)
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// 2. Metrics & Code: JetBrains Mono
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

// 3. Editorial Serif: Instrument Serif
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

// 4. Posters & Display: Fraunces
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

// 5. Luxury Templates: Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

// 6. Modern Bistro & Friendly UI: Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FrameUp — Your business online in 5 minutes",
  description: "AI-powered instant website generator for local businesses.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${fraunces.variable} ${playfairDisplay.variable} ${poppins.variable}`}
    >
      <body className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased font-sans selection:bg-[#0066cc] selection:text-white">
        {children}
      </body>
    </html>
  );
}
