// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import supabaseServer from "../../lib/supabase/server-secret";
// import type { Session } from "@supabase/supabase-js";
// import supabaseServerPublic from "../../lib/supabase/server-public";

// interface LoginRequestBody {
//   email: string;
//   password: string;
// }

// interface LoginResponse {
//   success: boolean;
//   error?: string;
// }

// export async function POST(
//   req: Request
// ): Promise<NextResponse<LoginResponse>> {
//   try {
//     const cookieStore = await cookies();
//     const existingToken = cookieStore.get("access_token");

//     // 1️⃣ Если токен уже есть — проверяем его
//     if (existingToken?.value) {


//       const { data } = await supabaseServerPublic.auth.getUser(existingToken.value);

//       if (data.user) {
//         return NextResponse.json({ success: true });
//       }
//     }

//     // 2️⃣ Если нет — логинимся
//     const { email, password } =
//       (await req.json()) as LoginRequestBody;

//     const normalizedEmail = email.toLowerCase();



//     const { data, error } =
//       await supabaseServerPublic.auth.signInWithPassword({
//         email: normalizedEmail,
//         password,
//       });

//     if (error || !data.session) {
//       return NextResponse.json(
//         { success: false, error: "Неверный email или пароль" },
//         { status: 401 }
//       );
//     }

//     const session: Session = data.session;

//     // 3️⃣ Проверяем наличие профиля
//     const { data: profile, error: profileError } =
//       await supabaseServer
//         .from("users")
//         .select("id")
//         .eq("auth_id", session.user.id)
//         .single();

//     if (profileError || !profile) {
//       return NextResponse.json(
//         { success: false, error: "Профиль не найден" },
//         { status: 404 }
//       );
//     }

//     // 4️⃣ Создаём ответ и кладём cookie
//     const response = NextResponse.json({ success: true });

//     response.cookies.set("access_token", session.access_token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 48, // 2 дня
//     });

//     response.cookies.set("refresh_token", session.refresh_token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 дней
//     });

//     return response;

//   } catch (err) {
//     const message =
//       err instanceof Error ? err.message : "Ошибка сервера";

//     return NextResponse.json(
//       { success: false, error: message },
//       { status: 500 }
//     );
//   }
// }

// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const cookieStore = cookies();
//   const res = NextResponse.json({ success: true });

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

//   const { email, password } = await req.json();

//   const { error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     return NextResponse.json(
//       { success: false, error: "Неверный email или пароль" },
//       { status: 401 }
//     );
//   }

//   return res;
// }


// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as LoginRequestBody;

    // Создаём объект ответа, в который Supabase будет писать cookie
    const res = NextResponse.json({ success: true });

    // SSR клиент Supabase с куками
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => {
            const cookieHeader = req.headers.get("cookie") || "";
            return cookieHeader.split("; ").map(c => {
              const [name, ...rest] = c.split("=");
              return { name, value: rest.join("=") };
            });
          },
          setAll: (cookiesToSet) =>
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set({ name, value, ...options })
            ),
        },
      }
    );

    // Логиним через auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { success: false, error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Supabase автоматически установит access_token и refresh_token в куки через res
    return res; // ✅ возвращаем именно res, чтобы cookie реально поставились

  } catch (err: unknown) {
    let message = "Ошибка сервера";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}