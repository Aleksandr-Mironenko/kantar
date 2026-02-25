// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import supabaseServer from "../../lib/supabase/server-secret";

// export async function POST() {
//   const cookieStore = await cookies();

//   const refreshToken = cookieStore.get("refresh_token")?.value;

//   // Инвалидируем refresh token в Supabase (важно!)
//   if (refreshToken) {
//     await supabaseServer.auth.admin.signOut(refreshToken);
//   }

//   // Удаляем cookies
//   cookieStore.delete("access_token");
//   cookieStore.delete("refresh_token");

//   // Редиректим на главную
//   return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL));
// }



// export async function POST(req: Request) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("access_token")?.value;
//   const res = NextResponse.redirect("/");

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get: (name) => cookieStore.get(name)?.value,
//         set: (name, value, options) =>
//           res.cookies.set({ name, value, ...options }),
//         remove: (name, options) =>
//           res.cookies.set({ name, value: "", ...options }),
//       },
//     }
//   );

//   await supabase.auth.signOut();

//   return res;
// }


// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies(); // SSR cookie
  const allCookies = (await cookieStore).getAll(); // массив cookie
  const res = NextResponse.redirect("/"); // редирект после logout

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

  await supabase.auth.signOut();

  return res;
}