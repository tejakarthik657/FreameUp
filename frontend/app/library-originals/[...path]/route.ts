import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Catch-all route that serves the original static HTML variants from
 * `frontend/templates/_library/originals/<category>/<variant>.html`.
 *
 * This lets the Workshop render the HTML-only categories (footer, about,
 * features, gallery, etc.) inside an iframe without us having to convert
 * 70+ files to TSX in one pass.
 *
 * Safety:
 *   - path is sanitized and restricted to the originals/ folder
 *   - only `.html` files are served
 *   - 404 on anything else
 */

const ROOT = path.join(process.cwd(), "templates", "_library", "originals");

function isSafePathSegments(segments: string[]): boolean {
  if (segments.length === 0) return false;
  for (const s of segments) {
    if (!s || s.includes("..") || s.includes("\0")) return false;
  }
  return true;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const segments = params.path || [];
  if (!isSafePathSegments(segments)) {
    return new NextResponse("Bad path", { status: 400 });
  }
  const filePath = path.join(ROOT, ...segments);
  if (!filePath.startsWith(ROOT)) {
    return new NextResponse("Bad path", { status: 400 });
  }
  if (!filePath.endsWith(".html")) {
    return new NextResponse("Only .html files are served here", { status: 403 });
  }
  try {
    const buf = await fs.readFile(filePath);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}