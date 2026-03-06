import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // -------------------------
  // НЕ АВТОРИЗОВАН
  // -------------------------

  if (!session) {

    if (pathname.startsWith("/login")) {
      return res;
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  // -------------------------
  // РОЛИ
  // -------------------------

  const payload = JSON.parse(
    Buffer.from(session.access_token.split(".")[1], "base64").toString()
  );

  const roles: string[] =
    payload.app_metadata?.roles ??
    payload.claims?.app_metadata?.roles ??
    [];

  const isAdmin = roles.includes("admin") || roles.includes("root");

  // -------------------------
  // ADMIN ROUTES
  // -------------------------

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL(`/lk`, req.url));
  }

  // -------------------------
  // USER ROUTES
  // -------------------------

  if (pathname.startsWith("/lk") && isAdmin) {
    return NextResponse.redirect(new URL(`/admin`, req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/lk/:path*", "/login"],
};