// import { createServerClient } from "@supabase/ssr";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import type { CookieOptions } from "@supabase/ssr";
// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return req.cookies.get(name)?.value;
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           res.cookies.set({ name, value, ...options });
//         },
//         remove(name: string, options: CookieOptions) {
//           res.cookies.set({ name, value: "", ...options });
//         },
//       },
//     }
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return res;
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };


import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // Создаём ответ, который будет возвращён
  const res = NextResponse.next();

  // Получаем все cookie из запроса
  const allCookies = req.cookies.getAll().map(c => ({
    name: c.name,
    value: c.value,
    options: {} as CookieOptions, // можно добавить secure, httpOnly и т.д.
  }));

  // Создаём Supabase SSR клиент с cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => allCookies,
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set({ name, value, ...options })
          ),
      },
    }
  );

  // Получаем текущего пользователя из Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Если пользователь не найден, редиректим на /login
  if (!user || error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Пользователь авторизован — пропускаем middleware
  return res;
}

// Применяем middleware только к защищённым маршрутам
export const config = {
  matcher: ["/admin/:path*"], // здесь можно указать любые пути
};


//СТОКА 76 ПОЛУЧЕНИЕ ДАННЫХ ИМЕННО ИЗ .getUser   User!!! - ЭТО НЕ АДМИНЫ