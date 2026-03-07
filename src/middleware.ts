// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {

//   const res = NextResponse.next();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => req.cookies.getAll(),
//         setAll: (cookiesToSet) => {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             res.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   const { pathname } = req.nextUrl;

//   // НЕ АВТОРИЗОВАН 
//   if (!session) {
//     if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
//       return res;
//     }

//     return NextResponse.redirect(new URL("/login", req.url));
//   }


//   // РОЛИ 
//   const payload = JSON.parse(
//     Buffer.from(session.access_token.split(".")[1], "base64").toString()
//   );

//   const roles: string[] =
//     payload.app_metadata?.roles ??
//     payload.claims?.app_metadata?.roles ??
//     [];

//   const isAdmin = roles.includes("admin") || roles.includes("root");
//   const nullRole = roles.includes("admin") || roles.includes("root") || roles.includes("support") || roles.includes("manager") || roles.includes("user");
//   // ADMIN ROUTES 
//   if (pathname.startsWith("/admin") && !isAdmin) {
//     return NextResponse.redirect(new URL(`/lk`, req.url));
//   }
//   if (pathname.startsWith("/login") && !isAdmin && !nullRole) {
//     return NextResponse.redirect(new URL(`/lk`, req.url));
//   }
//   if (pathname.startsWith("/register") && !isAdmin && nullRole) {
//     return NextResponse.redirect(new URL(`/register`, req.url));
//   }
//   if (pathname.startsWith("/register") && !isAdmin && !nullRole) {
//     return NextResponse.redirect(new URL(`/lk`, req.url));
//   }

//   // USER ROUTES 
//   if (pathname.startsWith("/lk") && isAdmin && !nullRole) {
//     return NextResponse.redirect(new URL(`/admin`, req.url));
//   }
//   if (pathname.startsWith("/login") && isAdmin && !nullRole) {
//     return NextResponse.redirect(new URL(`/admin`, req.url));
//   }
//   if (pathname.startsWith("/register") && isAdmin && !nullRole) {
//     return NextResponse.redirect(new URL(`/admin`, req.url));
//   }

//   return res;
// }

// export const config = {
//   matcher: ["/admin/:path*", "/lk/:path*", "/login", "/register"],
// };




//////////////////////////////////////
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

  // -----------------------------
  // 1. НЕ АВТОРИЗОВАН
  // -----------------------------
  if (!session) {
    // доступно только login и register
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return res;
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  // -----------------------------
  // 2. АВТОРИЗОВАН — ЧИТАЕМ РОЛИ
  // -----------------------------
  const payload = JSON.parse(
    Buffer.from(session.access_token.split(".")[1], "base64").toString()
  );

  const roles: string[] =
    payload.app_metadata?.roles ??
    payload.claims?.app_metadata?.roles ??
    [];

  const isAdmin = roles.includes("admin") || roles.includes("root");
  const hasAnyRole = roles.length > 0;

  // -----------------------------
  // 3. ЛОГИКА ДЛЯ ADMIN / ROOT
  // -----------------------------
  if (isAdmin) {
    // admin НЕ должен попадать на login
    if (pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // admin может заходить на register
    return res;
  }

  // -----------------------------
  // 4. ЛОГИКА ДЛЯ ПОЛЬЗОВАТЕЛЕЙ С РОЛЯМИ (но не admin/root)
  // -----------------------------
  if (hasAnyRole) {
    // запрещаем login и register
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return NextResponse.redirect(new URL("/lk", req.url));
    }

    // запрещаем admin
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/lk", req.url));
    }

    return res;
  }

  // -----------------------------
  // 5. ПОЛЬЗОВАТЕЛЬ БЕЗ РОЛЕЙ
  // -----------------------------
  if (!hasAnyRole) {
    // доступно login и register
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return res;
    }

    // запрещено admin и lk
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/lk/:path*", "/login", "/register"],
};
