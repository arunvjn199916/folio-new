import { NextResponse, type NextRequest } from "next/server";
import { isLocale, negotiate, LOCALE_COOKIE } from "@/i18n/config";

// Locale-less URLs (/, /ai-workflow, /work/x) redirect to the visitor's language:
// their saved choice (cookie) first, then the browser's Accept-Language, then English.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : negotiate(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API, Next internals and anything that looks like a file (images, fonts, cursors, PDF, robots, sitemap).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

