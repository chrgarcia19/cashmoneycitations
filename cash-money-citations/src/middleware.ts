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



  if (request.nextUrl.pathname.startsWith('/new')) {
    const token = await getUserToken();

    if (!token) {
      const url = new URL(`/api/auth/signin`, request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }


    if (token.role === null) {
      const url = new URL(`/error/401`, request.url);
      return NextResponse.rewrite(url);
    }
  }

  if (requireAuth.some((path) => pathname.startsWith(path))) {
    const token = await getUserToken();

    //check not authenticated
    if (!token) {
      const url = new URL(`/api/auth/signin`, request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // check if not authorized
    if (token.role !== "admin") {
      const url = new URL(`/error/401`, request.url);
      return NextResponse.rewrite(url);
    }
  }
  return res;
}
