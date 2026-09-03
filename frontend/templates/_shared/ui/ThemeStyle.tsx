"use client";

export function ThemeStyle({ theme }: { theme?: { primary?: string; secondary?: string; accent?: string; font?: string; heading_font?: string; body_font?: string } }) {
  if (!theme) return null;

  const fontName = theme.heading_font || theme.font || "Fraunces";
  const bodyFontName = theme.body_font || "DM Sans";
  
  // URL encode font names for Google Fonts link
  const fontUrlParam = encodeURIComponent(fontName).replace(/%20/g, "+");
  const bodyFontUrlParam = encodeURIComponent(bodyFontName).replace(/%20/g, "+");
  const primary = theme.primary || "#8b4513";
  const secondary = theme.secondary || "#f5e6d3";
  const accent = theme.accent || secondary;
  
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=${fontUrlParam}:wght@300;400;500;600;700&family=${bodyFontUrlParam}:wght@300;400;500;600&display=swap');
    
    :root {
      --theme-primary: ${primary};
      --theme-secondary: ${secondary};
      --theme-accent: ${accent};
      --font-heading: '${fontName}', serif;
      --font-body: '${bodyFontName}', sans-serif;
    }
  `;
  
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
