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

  let isSubdomain = false;
  let subdomain = "";

  if (hostname.endsWith(".vercel.app")) {
    // Vercel deployments: user site subdomains have format <slug>.<project>.vercel.app (4+ parts)
    if (parts.length >= 4) {
      isSubdomain = true;
      subdomain = parts[0];
    }
  } else if (hostname.endsWith("localhost")) {
    // Localhost: format <slug>.localhost (2 parts)
    if (parts.length === 2 && parts[0] !== "localhost") {
      isSubdomain = true;
      subdomain = parts[0];
    }
  } else {
    // Production wildcard: e.g. <slug>.devframes.in (3 parts)
    if (parts.length === 3 && parts[0] !== "www") {
      isSubdomain = true;
      subdomain = parts[0];
    }
  }

  if (isSubdomain && subdomain && subdomain !== "www") {
    // Rewrite the URL internally to the preview path
    url.pathname = `/preview/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
