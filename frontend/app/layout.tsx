import type { Metadata } from "next";
import {
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

// ── 3-FONT TYPOGRAPHY SYSTEM ──
// 1. Display Headings: Instrument Serif
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

// 2. Primary Body & UI: Inter
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

// 3. Badges & Code & Metrics: JetBrains Mono
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "FrameUp — Your business online in 5 minutes",
  description: "AI-powered instant website generator for local businesses.",
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased font-sans selection:bg-[#0066cc] selection:text-white">
        {children}
      </body>
    </html>
  );
}
