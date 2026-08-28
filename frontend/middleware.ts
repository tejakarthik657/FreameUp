import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  // Exclude static assets, api requests, next internal files, and logo uploads
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/style-previews") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get subdomain from Host header (e.g. indigo-f284.localhost:3000)
  const hostname = host.split(":")[0]; // remove port
  const parts = hostname.split(".");

  // If there's a subdomain (e.g., parts is ["indigo-f284", "localhost"])
  if (parts.length > 1) {
    const subdomain = parts[0];
    
    // Ignore localhost, www, and other standard root entrypoints
    if (
      subdomain !== "localhost" && 
      subdomain !== "www" && 
      subdomain !== "devframes"
    ) {
      // Rewrite the URL internally to the preview path
      url.pathname = `/preview/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
