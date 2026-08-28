"use client";

export function ThemeStyle({ theme }: { theme: any }) {
  if (!theme) return null;

  const fontName = theme.font || "Playfair Display";
  const bodyFontName = theme.body_font || "DM Sans";
  
  // URL encode font names for Google Fonts link
  const fontUrlParam = fontName.replace(/ /g, "+");
  const bodyFontUrlParam = bodyFontName.replace(/ /g, "+");
  
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=${fontUrlParam}:wght@300;400;500;600;700&family=${bodyFontUrlParam}:wght@300;400;500;600&display=swap');
    
    :root {
      --theme-primary: ${theme.primary};
      --theme-secondary: ${theme.secondary};
      --theme-accent: ${theme.accent || theme.secondary || "#c9a84c"};
      --font-heading: '${fontName}', serif;
      --font-body: '${bodyFontName}', sans-serif;
    }
  `;
  
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
