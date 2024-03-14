// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
// Paths that require authentication or authorization
const requireAuth: string[] = ["/admin"];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  async function getUserToken() {
    const token = await getToken({
      req: request,
      secret: process.env.SECRET,
    });
    return token;
  }

  function redirectOrRewrite(urlPath: string, isRewrite = false) {
    const url = new URL(urlPath, request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return isRewrite ? NextResponse.rewrite(url) : NextResponse.redirect(url);
  }

  if (requireAuth.some((path) => pathname.startsWith(path))) {
    const token = await getUserToken();

    if (!token) {
      return redirectOrRewrite(`/api/auth/signin`);
    }

    if (pathname.startsWith('/admin') && token.role !== "admin") {
      return redirectOrRewrite(`/error/401`, true);
    }

    if (pathname.startsWith('/profile') && token.accountType !== "credential") {
      return redirectOrRewrite(`/error/401`, true);
    }

    if (pathname.startsWith('/new') && token.role === null) {
      return redirectOrRewrite(`/error/401`, true);
    }

  }

  return res;
}
